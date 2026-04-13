import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";
import { formatPrice, formatDate } from "@/lib/utils";
import { ClearCartOnSuccess } from "./clear-cart";

export const metadata: Metadata = { title: "Order Confirmed" };
export const dynamic = "force-dynamic";

interface Props {
  searchParams: { session_id?: string };
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const sessionId = searchParams.session_id;

  // Try to find the order — webhook may not have fired yet; handle gracefully
  const order = sessionId
    ? await db.order.findUnique({
        where: { stripeSessionId: sessionId },
        include: { items: true },
      })
    : null;

  return (
    <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      {/* Clear the Zustand cart in the browser */}
      <ClearCartOnSuccess />

      <div className="w-full max-w-lg">
        <div className="text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
          <h1 className="mt-5 font-display text-2xl font-semibold text-espresso">
            Order Confirmed!
          </h1>
          <p className="mt-2 text-muted-foreground">
            Thank you for your order. We&apos;ve received your payment and will
            start preparing your coffee.
          </p>
          {order && (
            <p className="mt-1 text-sm font-medium text-foreground">
              Order {order.orderNumber}
            </p>
          )}
          <p className="mt-3 text-sm text-muted-foreground">
            A confirmation email is on its way to your inbox.
          </p>
        </div>

        {/* Order summary — only shown when webhook has already created the record */}
        {order && order.items.length > 0 && (
          <div className="mt-8 rounded-xl border border-border bg-card">
            <div className="flex justify-between px-5 pt-4 pb-3">
              <span className="text-sm text-muted-foreground">
                {formatDate(order.createdAt)}
              </span>
              <span className="text-sm font-semibold">
                {formatPrice(order.total)}
              </span>
            </div>
            <Separator />
            <ul className="divide-y divide-border">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 px-5 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-snug line-clamp-1">
                      {item.productName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.variantName} · Qty {item.quantity}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-medium">
                    {formatPrice(item.total)}
                  </p>
                </li>
              ))}
            </ul>
            {order.shippingCost > 0 && (
              <>
                <Separator />
                <div className="flex justify-between px-5 py-3 text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{formatPrice(order.shippingCost)}</span>
                </div>
              </>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/account/orders">View My Orders</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
