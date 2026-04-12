import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { MobileNav } from "@/components/layout/mobile-nav";
import enMessages from "@/messages/en.json";
import "@/app/globals.css";

// NOTE: next/font/google requires network at build time.
// Font CSS variables (--font-inter, --font-playfair) fall back to system
// stacks defined in globals.css. Re-enable next/font when deploying with
// network access.
//
// NOTE: We pass messages directly to avoid header reads that block static
// rendering. Phase 2 can introduce locale routing with setRequestLocale.

export const metadata: Metadata = {
  title: {
    default: "Qahwa & Co — Specialty Coffee Rooted in Tradition",
    template: "%s | Qahwa & Co",
  },
  description:
    "Premium specialty coffee and tea, rooted in tradition. Ethically sourced from Yemen, Ethiopia, and beyond.",
  keywords: [
    "coffee",
    "specialty coffee",
    "Arabic coffee",
    "qahwa",
    "tea",
    "coffee subscription",
    "single origin",
  ],
  authors: [{ name: "Qahwa & Co" }],
  creator: "Qahwa & Co",
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Qahwa & Co",
    title: "Qahwa & Co — Specialty Coffee Rooted in Tradition",
    description: "Premium specialty coffee and tea, rooted in tradition.",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@qahwaco",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <NextIntlClientProvider locale="en" messages={enMessages}>
          <Providers>
            {/* App shell */}
            <Header />
            <MobileNav />

            {/* Page content */}
            <main className="min-h-[calc(100vh-4rem)]">{children}</main>

            <Footer />

            {/* Cart drawer slot — always mounted, open state managed by store */}
            <CartDrawer />
          </Providers>
        </NextIntlClientProvider>

        {/* Toast notifications */}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
