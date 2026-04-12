// Qahwa & Co — Application Constants

// ── Brand ────────────────────────────────────────────────────────────────────
export const BRAND_NAME = "Qahwa & Co";
export const BRAND_TAGLINE = "Specialty Coffee Rooted in Tradition";
export const BRAND_EMAIL = "hello@qahwa.co";
export const BRAND_PHONE = "+44 (0) 20 0000 0000";
export const SOCIAL_INSTAGRAM = "https://instagram.com/qahwaco";
export const SOCIAL_TWITTER = "https://twitter.com/qahwaco";

// ── Commerce ─────────────────────────────────────────────────────────────────
/** All monetary values are stored and handled in pence (GBP ÷ 100) */
export const CURRENCY = "GBP";
export const CURRENCY_LOCALE = "en-GB";

/** Free shipping threshold in pence — £40.00 */
export const FREE_SHIPPING_THRESHOLD = 4000;

/** Standard UK shipping in pence — £3.95 */
export const DEFAULT_SHIPPING_RATE = 395;

/** VAT rate (20% UK standard rate) — applied to display only */
export const VAT_RATE = 0.2;

/** Maximum items per product in cart */
export const MAX_CART_QUANTITY = 20;

/** "Subscribe & Save" discount percentage — Phase 2 */
export const SUBSCRIPTION_DISCOUNT_PERCENT = 10;

// ── Product Display ───────────────────────────────────────────────────────────
export const PRODUCTS_PER_PAGE = 12;
export const RELATED_PRODUCTS_COUNT = 4;
export const LOW_STOCK_THRESHOLD = 5;

// ── Product Categories (matches Prisma ProductCategory enum) ─────────────────
export const PRODUCT_CATEGORIES = [
  { value: "COFFEE", label: "Coffee", slug: "coffee" },
  { value: "TEA", label: "Tea", slug: "tea" },
  { value: "GIFT_SET", label: "Gift Sets", slug: "gifts" },
  { value: "ACCESSORY", label: "Accessories", slug: "accessories" },
] as const;

// ── Roast Levels ─────────────────────────────────────────────────────────────
export const ROAST_LEVELS = [
  { value: "LIGHT", label: "Light Roast" },
  { value: "MEDIUM_LIGHT", label: "Medium-Light Roast" },
  { value: "MEDIUM", label: "Medium Roast" },
  { value: "MEDIUM_DARK", label: "Medium-Dark Roast" },
  { value: "DARK", label: "Dark Roast" },
  { value: "EXTRA_DARK", label: "Extra Dark Roast" },
] as const;

// ── Grind Options ─────────────────────────────────────────────────────────────
export const GRIND_OPTIONS = [
  { value: "WHOLE_BEAN", label: "Whole Bean" },
  { value: "COARSE", label: "Coarse (French Press / Cold Brew)" },
  { value: "MEDIUM", label: "Medium (Pour Over / Filter)" },
  { value: "FINE", label: "Fine (Aeropress / Moka Pot)" },
  { value: "ESPRESSO_GRIND", label: "Espresso Grind" },
  { value: "TURKISH", label: "Turkish (Extra Fine)" },
  { value: "TEA_LOOSE_LEAF", label: "Loose Leaf" },
  { value: "TEA_BAGS", label: "Tea Bags" },
] as const;

// ── Navigation ────────────────────────────────────────────────────────────────
export const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  {
    href: "/collections/coffee",
    label: "Coffee",
    children: [
      { href: "/collections/arabic-coffee", label: "Arabic Qahwa" },
      { href: "/collections/single-origin", label: "Single Origin" },
      { href: "/collections/blends", label: "Signature Blends" },
      { href: "/collections/espresso", label: "Espresso" },
    ],
  },
  { href: "/collections/tea", label: "Tea" },
  { href: "/collections/gifts", label: "Gifts" },
  { href: "/our-story", label: "Our Story" },
] as const;

export const FOOTER_LINKS = {
  shop: [
    { href: "/shop", label: "All Products" },
    { href: "/collections/coffee", label: "Coffee" },
    { href: "/collections/tea", label: "Tea" },
    { href: "/collections/gifts", label: "Gift Sets" },
    { href: "/subscriptions", label: "Subscribe & Save" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/our-story", label: "Our Story" },
    { href: "/origins", label: "Coffee Origins" },
    { href: "/wholesale", label: "Wholesale" },
    { href: "/contact", label: "Contact" },
  ],
  support: [
    { href: "/faq", label: "FAQ" },
    { href: "/shipping", label: "Shipping Info" },
    { href: "/returns", label: "Returns" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
} as const;

// ── Order Statuses ────────────────────────────────────────────────────────────
export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

export const FULFILLMENT_STATUS_LABELS: Record<string, string> = {
  UNFULFILLED: "Unfulfilled",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
};

// ── Coffee Origins ────────────────────────────────────────────────────────────
export const COFFEE_ORIGINS = [
  "Yemen",
  "Ethiopia",
  "Colombia",
  "Brazil",
  "Guatemala",
  "Kenya",
  "Costa Rica",
  "Indonesia",
  "India",
] as const;

// ── Wholesale Business Types ──────────────────────────────────────────────────
export const WHOLESALE_BUSINESS_TYPES = [
  { value: "cafe", label: "Café / Coffee Shop" },
  { value: "restaurant", label: "Restaurant / Dining" },
  { value: "hotel", label: "Hotel / Hospitality" },
  { value: "retailer", label: "Retail / Specialty Store" },
  { value: "online", label: "Online Retailer" },
  { value: "corporate", label: "Corporate / Office" },
  { value: "other", label: "Other" },
] as const;
