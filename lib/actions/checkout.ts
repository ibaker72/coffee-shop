"use server";

import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { FREE_SHIPPING_THRESHOLD, DEFAULT_SHIPPING_RATE } from "@/lib/constants";
import type { CartItem, ActionResult, CheckoutSessionResponse } from "@/types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

/**
 * Validate cart items against DB and create a Stripe Checkout session.
 * Always uses DB prices — never trusts client-side price snapshots.
 */
export async function createCheckoutSession(
  items: CartItem[]
): Promise<ActionResult<CheckoutSessionResponse>> {
  if (!items.length) {
    return { success: false, error: "Your cart is empty." };
  }

  const session = await getServerSession(authOptions);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  // ── Validate items against DB ────────────────────────────────────────────────
  const variantIds = items.map((i) => i.variantId);
  const variants = await db.productVariant.findMany({
    where: { id: { in: variantIds }, active: true },
    include: {
      product: {
        select: { id: true, name: true, slug: true, images: true, active: true },
      },
    },
  });

  const variantMap = new Map(variants.map((v) => [v.id, v]));

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  let subtotal = 0;

  for (const item of items) {
    const variant = variantMap.get(item.variantId);

    if (!variant || !variant.product.active) {
      return {
        success: false,
        error: `"${item.productName}" is no longer available.`,
      };
    }

    if (variant.stock < item.quantity) {
      return {
        success: false,
        error: `Only ${variant.stock} unit(s) of "${item.productName} – ${item.variantName}" are in stock.`,
      };
    }

    subtotal += variant.price * item.quantity;

    lineItems.push({
      price_data: {
        currency: "gbp",
        // Always use live DB price — never trust client snapshot
        unit_amount: variant.price,
        product_data: {
          name: `${variant.product.name} – ${variant.name}`,
          images: variant.product.images.length
            ? [variant.product.images[0]]
            : [],
          metadata: {
            productId: variant.productId,
            variantId: variant.id,
            productSlug: variant.product.slug,
          },
        },
      },
      quantity: item.quantity,
    });
  }

  const shippingCost =
    subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : DEFAULT_SHIPPING_RATE;

  // ── Create Stripe Checkout session ───────────────────────────────────────────
  let checkoutSession: Stripe.Checkout.Session;
  try {
    checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      shipping_address_collection: {
        allowed_countries: [
          "GB",
          "AE",
          "SA",
          "KW",
          "QA",
          "BH",
          "OM",
          "JO",
          "US",
          "CA",
          "AU",
          "NZ",
          "DE",
          "FR",
          "NL",
          "BE",
          "SE",
          "NO",
          "DK",
        ],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: shippingCost, currency: "gbp" },
            display_name:
              shippingCost === 0 ? "Free Shipping" : "Standard Shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 3 },
              maximum: { unit: "business_day", value: 5 },
            },
          },
        },
      ],
      customer_email: session?.user?.email ?? undefined,
      metadata: {
        userId: session?.user?.id ?? "",
      },
      payment_intent_data: {
        metadata: {
          userId: session?.user?.id ?? "",
        },
      },
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout/cancel`,
    });
  } catch (err) {
    console.error("Stripe session creation failed:", err);
    return { success: false, error: "Could not initiate checkout. Please try again." };
  }

  if (!checkoutSession.url) {
    return { success: false, error: "Failed to create checkout session." };
  }

  return {
    success: true,
    data: { url: checkoutSession.url, sessionId: checkoutSession.id },
  };
}
