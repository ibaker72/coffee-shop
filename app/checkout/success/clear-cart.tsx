"use client";

import { useEffect } from "react";
import { useCartStore } from "@/stores/cart-store";

/**
 * Clears the Zustand cart on mount.
 * Must be a client component — server components cannot access Zustand.
 * Rendered once on the success page to clean up after a completed checkout.
 */
export function ClearCartOnSuccess() {
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return null;
}
