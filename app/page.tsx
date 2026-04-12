import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/constants";

export default function HomePage() {
  return (
    <section className="container flex flex-col items-center justify-center py-24 text-center">
      <h1 className="font-display text-4xl font-semibold text-espresso sm:text-5xl lg:text-6xl">
        {BRAND_NAME}
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">{BRAND_TAGLINE}</p>
    </section>
  );
}
