import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely — required by shadcn/ui */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format an integer price (pence/cents) to a localised currency string.
 * @param amount - Price in pence (e.g. 1299 = £12.99)
 * @param currency - ISO 4217 currency code (default "GBP")
 * @param locale - BCP 47 locale string (default "en-GB")
 */
export function formatPrice(
  amount: number,
  currency = "GBP",
  locale = "en-GB"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount / 100);
}

/**
 * Format a Date object or ISO string to a localised date string.
 */
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  },
  locale = "en-GB"
): string {
  return new Intl.DateTimeFormat(locale, options).format(new Date(date));
}

/**
 * Convert a string to a URL-safe slug.
 * e.g. "Arabic Qahwa – Cardamom Blend" → "arabic-qahwa-cardamom-blend"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // remove special chars (keep hyphens)
    .replace(/[\s_-]+/g, "-") // replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, ""); // trim leading/trailing hyphens
}

/**
 * Calculate the discount percentage between two prices.
 * @param original - Original price in pence
 * @param sale - Sale price in pence
 */
export function discountPercent(original: number, sale: number): number {
  return Math.round(((original - sale) / original) * 100);
}

/**
 * Truncate a string to a given length, appending "…" if needed.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

/**
 * Generate a human-readable order number.
 * Format: QC-YYYY-NNNNN (e.g. QC-2026-00042)
 */
export function generateOrderNumber(sequence: number): string {
  const year = new Date().getFullYear();
  const padded = String(sequence).padStart(5, "0");
  return `QC-${year}-${padded}`;
}

/**
 * Convert pence to pounds as a float (for Stripe amount formatting).
 */
export function penceToFloat(pence: number): number {
  return pence / 100;
}

/**
 * Convert a price float to pence integer (for storing in DB).
 */
export function floatToPence(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Check if a collection is currently active based on its date range.
 */
export function isCollectionActive(
  startDate: Date | null | undefined,
  endDate: Date | null | undefined
): boolean {
  const now = new Date();
  if (startDate && now < startDate) return false;
  if (endDate && now > endDate) return false;
  return true;
}

/**
 * Get star rating display array for a given rating (1–5).
 * Returns an array of "full" | "empty" strings.
 */
export function getRatingStars(
  rating: number
): Array<"full" | "half" | "empty"> {
  return Array.from({ length: 5 }, (_, i) => {
    if (i < Math.floor(rating)) return "full";
    if (i < rating) return "half";
    return "empty";
  });
}

/**
 * Safely get a Cloudinary image URL with transformations.
 * Falls back to a placeholder if no URL is provided.
 */
export function getProductImageUrl(
  imageUrl: string | null | undefined,
  width = 800,
  height = 800
): string {
  if (!imageUrl) {
    return `/images/placeholder/product-${width}x${height}.jpg`;
  }
  return imageUrl;
}
