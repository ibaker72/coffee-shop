"use client";

import { ShoppingBag, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cart-store";
import { Button } from "@/components/ui/button";
import type { CartItem } from "@/types";

interface AddToCartButtonProps {
  item: Omit<CartItem, "quantity">;
  disabled?: boolean;
  outOfStock?: boolean;
}

export function AddToCartButton({
  item,
  disabled,
  outOfStock,
}: AddToCartButtonProps) {
  const { addItem, openDrawer } = useCartStore();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem({ ...item, quantity: 1 });
    openDrawer();
    toast.success(`${item.productName} added to cart`);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (outOfStock) {
    return (
      <Button className="w-full" disabled size="lg" variant="secondary">
        Out of Stock
      </Button>
    );
  }

  return (
    <Button
      className="w-full"
      size="lg"
      disabled={disabled || added}
      onClick={handleClick}
    >
      {added ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Added to Cart
        </>
      ) : (
        <>
          <ShoppingBag className="mr-2 h-4 w-4" />
          Add to Cart
        </>
      )}
    </Button>
  );
}
