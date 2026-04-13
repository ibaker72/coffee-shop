import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | Qahwa & Co",
};

export default function FaqPage() {
  return (
    <div className="container py-8 lg:py-12">
      <h1 className="font-display text-3xl font-semibold text-espresso">Frequently Asked Questions</h1>
      <p className="mt-4 text-muted-foreground">
        This page is coming soon. Check back shortly.
      </p>
    </div>
  );
}
