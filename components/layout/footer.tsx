import Link from "next/link";
import { Instagram, Twitter } from "lucide-react";
import {
  BRAND_NAME,
  BRAND_TAGLINE,
  BRAND_EMAIL,
  FOOTER_LINKS,
  SOCIAL_INSTAGRAM,
  SOCIAL_TWITTER,
} from "@/lib/constants";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-espresso text-espresso-foreground">
      <div className="container py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="font-display text-2xl font-semibold text-cream"
            >
              {BRAND_NAME}
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-espresso-foreground/70">
              {BRAND_TAGLINE}. Ethically sourced specialty coffee and tea,
              delivered to your door.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href={SOCIAL_INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-espresso-foreground/60 hover:text-cream transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={SOCIAL_TWITTER}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="text-espresso-foreground/60 hover:text-cream transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
            <a
              href={`mailto:${BRAND_EMAIL}`}
              className="mt-4 block text-sm text-espresso-foreground/60 hover:text-cream transition-colors"
            >
              {BRAND_EMAIL}
            </a>
          </div>

          {/* Shop links */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-cream/60">
              Shop
            </h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-espresso-foreground/70 hover:text-cream transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-cream/60">
              Company
            </h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-espresso-foreground/70 hover:text-cream transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-cream/60">
              Support
            </h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-espresso-foreground/70 hover:text-cream transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-espresso-foreground/20" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-espresso-foreground/50">
            &copy; {currentYear} {BRAND_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-espresso-foreground/40">
            Specialty coffee rooted in tradition
          </p>
        </div>
      </div>
    </footer>
  );
}
