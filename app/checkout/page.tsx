"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/stores/cart-store";
import { createCheckoutSession } from "@/lib/actions/checkout";
import { formatPrice } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD, DEFAULT_SHIPPING_RATE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Loader2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal);
  const [isLoading, setIsLoading] = useState(false);

  const sub = subtotal();
  const shipping = sub >= FREE_SHIPPING_THRESHOLD ? 0 : DEFAULT_SHIPPING_RATE;
  const total = sub + shipping;

  async function handleCheckout() {
    if (!items.length) return;
    setIsLoading(true);
    try {
      const result = await createCheckoutSession(items);
      if (!result.success) {
        toast.error(result.error);
        setIsLoading(false);
        return;
      }
      // Hard navigate — Stripe Checkout is a full-page redirect
      window.location.href = result.data!.url;
    } catch {
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }

  if (!items.length) {
    return (
      <div className="container flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center gap-4 py-12 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/40" />
        <div>
          <p className="text-lg font-semibold">Your cart is empty</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add some products before checking out.
          </p>
        </div>
        <Button asChild>
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 lg:py-12">
      {/* Back link + heading */}
      <div className="mb-6">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>
        <h1 className="mt-4 font-display text-2xl font-semibold text-espresso">
          Review Your Order
        </h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* ── Item list ─────────────────────────────────────────────────────── */}
        <div>
          <div className="rounded-xl border border-border bg-card">
            <ul className="divide-y divide-border">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 p-4">
                  {item.imageUrl && (
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                      <Image
                        src={item.imageUrl}
                        alt={item.productName}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div>
                      <Link
                        href={`/products/${item.productSlug}`}
                        className="font-medium leading-snug hover:underline line-clamp-2"
                      >
                        {item.productName}
                      </Link>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {item.variantName}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-semibold">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(item.unitPrice)} each
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Order summary ─────────────────────────────────────────────────── */}
        <div>
          <div className="rounded-xl border border-border bg-card p-5 sticky top-24">
            <h2 className="font-semibold text-foreground mb-4">
              Order Summary
            </h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Subtotal ({items.length} {items.length === 1 ? "item" : "items"})
                </span>
                <span>{formatPrice(sub)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      Free
                    </span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>
            </div>

            {shipping > 0 && (
              <p className="mt-2 text-xs text-muted-foreground">
                Free shipping on orders over{" "}
                {formatPrice(FREE_SHIPPING_THRESHOLD)}
              </p>
            )}

            <Separator className="my-4" />

            <div className="flex justify-between font-semibold text-base">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              VAT included · Shipping address collected at checkout
            </p>

            <Button
              className="mt-5 w-full"
              size="lg"
              onClick={handleCheckout}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redirecting to Stripe…
                </>
              ) : (
                "Proceed to Checkout"
              )}
            </Button>

            <p className="mt-3 text-center text-xs text-muted-foreground">
              Secure checkout powered by Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
