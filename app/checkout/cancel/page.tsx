import type { Metadata } from "next";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Checkout Cancelled" };

export default function CheckoutCancelPage() {
  return (
    <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      <div className="w-full max-w-md text-center">
        <XCircle className="mx-auto h-16 w-16 text-muted-foreground/40" />

        <h1 className="mt-6 font-display text-2xl font-semibold text-foreground">
          Checkout Cancelled
        </h1>
        <p className="mt-2 text-muted-foreground">
          No worries — your cart items are saved and waiting for you.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/checkout">Return to Cart</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
