"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD, DEFAULT_SHIPPING_RATE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    removeItem,
    updateQuantity,
    itemCount,
    subtotal,
  } = useCartStore();

  const count = itemCount();
  const sub = subtotal();
  const shippingCost = sub >= FREE_SHIPPING_THRESHOLD ? 0 : DEFAULT_SHIPPING_RATE;
  const freeShippingRemaining = FREE_SHIPPING_THRESHOLD - sub;

  return (
    <Sheet open={isDrawerOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Your Cart
            {count > 0 && (
              <span className="ml-auto text-sm font-normal text-muted-foreground">
                {count} {count === 1 ? "item" : "items"}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/40" />
            <div>
              <p className="font-medium text-foreground">Your cart is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add some coffee to get started
              </p>
            </div>
            <Button onClick={closeDrawer} asChild>
              <Link href="/shop">Browse Shop</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Free shipping progress */}
            {freeShippingRemaining > 0 && (
              <div className="rounded-lg bg-muted px-4 py-3 text-sm">
                Spend{" "}
                <span className="font-semibold text-foreground">
                  {formatPrice(freeShippingRemaining)}
                </span>{" "}
                more for free shipping
              </div>
            )}
            {freeShippingRemaining <= 0 && (
              <div className="rounded-lg bg-olive/10 px-4 py-3 text-sm text-olive-foreground">
                You qualify for{" "}
                <span className="font-semibold">free shipping</span>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-2">
              <ul className="divide-y divide-border">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-4 py-4">
                    {/* Image */}
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.productName}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ShoppingBag className="h-8 w-8 text-muted-foreground/40" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <div>
                          <Link
                            href={`/products/${item.productSlug}`}
                            onClick={closeDrawer}
                            className="text-sm font-medium hover:underline"
                          >
                            {item.productName}
                          </Link>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {item.variantName}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          aria-label={`Remove ${item.productName}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-auto flex items-center justify-between">
                        {/* Quantity controls */}
                        <div className="flex items-center gap-2 rounded-md border border-border">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-semibold">
                            {formatPrice(item.unitPrice * item.quantity)}
                          </p>
                          {item.compareAt && item.compareAt > item.unitPrice && (
                            <p className="text-xs text-muted-foreground line-through">
                              {formatPrice(item.compareAt * item.quantity)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="space-y-4 border-t border-border pt-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(sub)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">
                    {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
                  </span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>{formatPrice(sub + shippingCost)}</span>
              </div>
              <Button className="w-full" size="lg" asChild>
                <Link href="/checkout" onClick={closeDrawer}>
                  Checkout
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={closeDrawer}
                asChild
              >
                <Link href="/cart">View Full Cart</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
