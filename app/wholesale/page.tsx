import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wholesale | Qahwa & Co",
};

export default function WholesalePage() {
  return (
    <div className="container py-8 lg:py-12">
      <h1 className="font-display text-3xl font-semibold text-espresso">Wholesale</h1>
      <p className="mt-4 text-muted-foreground">
        This page is coming soon. Check back shortly.
      </p>
    </div>
  );
}
