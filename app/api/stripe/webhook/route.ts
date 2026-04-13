import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { generateOrderNumber } from "@/lib/utils";
import { buildOrderItems } from "@/lib/actions/cart-to-order";
import { Resend } from "resend";

// Stripe client is safe to initialise at module level (doesn't throw without key)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(request: NextRequest) {
  // MUST read raw text — JSON parsing corrupts the signature
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[webhook] Signature verification failed:", message);
    return NextResponse.json(
      { error: `Webhook error: ${message}` },
      { status: 400 }
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
    }
  } catch (err) {
    console.error("[webhook] Handler error:", err);
    // Return 500 so Stripe retries the event
    return NextResponse.json(
      { error: "Internal handler error" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  // ── Idempotency guard ────────────────────────────────────────────────────────
  const existing = await db.order.findUnique({
    where: { stripeSessionId: session.id },
    select: { id: true },
  });
  if (existing) {
    console.log("[webhook] Order already exists for session:", session.id);
    return;
  }

  // ── Expand line items (not included in webhook payload by default) ───────────
  const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ["line_items.data.price.product"],
  });

  const lineItems = fullSession.line_items?.data ?? [];
  const orderItems = await buildOrderItems(lineItems);

  if (!orderItems.length) {
    console.error("[webhook] No valid order items for session:", session.id);
    return;
  }

  // ── Financials ───────────────────────────────────────────────────────────────
  const subtotal = orderItems.reduce(
    (sum, i) => sum + i.unitPrice * i.quantity,
    0
  );
  const shippingCost = fullSession.shipping_cost?.amount_total ?? 0;
  const total = fullSession.amount_total ?? subtotal + shippingCost;

  // ── Shipping address snapshot ────────────────────────────────────────────────
  const shippingDetails = fullSession.shipping_details;
  const addr = shippingDetails?.address;
  const nameParts = (shippingDetails?.name ?? "").split(" ");
  const shippingAddress = {
    firstName: nameParts[0] ?? "",
    lastName: nameParts.slice(1).join(" "),
    line1: addr?.line1 ?? "",
    line2: addr?.line2 ?? undefined,
    city: addr?.city ?? "",
    state: addr?.state ?? undefined,
    postalCode: addr?.postal_code ?? "",
    country: addr?.country ?? "GB",
  };

  // ── Order number (sequential, human-readable) ────────────────────────────────
  const orderCount = await db.order.count();
  const orderNumber = generateOrderNumber(orderCount + 1);

  // ── Stripe payment reference ─────────────────────────────────────────────────
  const stripePaymentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : (session.payment_intent as Stripe.PaymentIntent | null)?.id ?? null;

  const userId = session.metadata?.userId || null;

  // ── Create order + items in a single transaction ─────────────────────────────
  const order = await db.order.create({
    data: {
      orderNumber,
      userId: userId || null,
      email: session.customer_details?.email ?? "",
      status: "PROCESSING",
      paymentStatus: "PAID",
      fulfillmentStatus: "UNFULFILLED",
      stripeSessionId: session.id,
      stripePaymentId,
      subtotal,
      shippingCost,
      taxAmount: 0, // UK prices include VAT
      discountAmount: 0,
      total,
      shippingAddress,
      items: {
        createMany: { data: orderItems },
      },
    },
    select: { id: true, orderNumber: true, email: true, total: true },
  });

  // ── Decrement stock for each purchased variant ───────────────────────────────
  await Promise.all(
    orderItems.map((item) =>
      db.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } },
      })
    )
  );

  // ── Send confirmation email (best-effort — never fail the webhook) ───────────
  if (order.email) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: `${process.env.RESEND_FROM_NAME ?? "Qahwa & Co"} <${process.env.RESEND_FROM_EMAIL ?? "orders@qahwa.co"}>`,
        to: [order.email],
        subject: `Order confirmed — ${order.orderNumber}`,
        text: [
          `Thank you for your order with Qahwa & Co!`,
          ``,
          `Order number: ${order.orderNumber}`,
          `Total: £${(order.total / 100).toFixed(2)}`,
          ``,
          `We'll email you again when your order ships.`,
          ``,
          `View your orders: ${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/account/orders`,
          ``,
          `The Qahwa & Co Team`,
        ].join("\n"),
      });
    } catch (emailErr) {
      console.error("[webhook] Failed to send confirmation email:", emailErr);
    }
  }

  console.log("[webhook] Order created:", order.orderNumber);
}
