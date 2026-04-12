import type {
  Product,
  ProductVariant,
  Category,
  Collection,
  Order,
  OrderItem,
  Review,
  User,
  GrindType,
  ProductCategory,
  ProductType,
  RoastLevel,
} from "@prisma/client";

// ─────────────────────────────────────────────────────────────────────────────
// Extended Prisma Types
// ─────────────────────────────────────────────────────────────────────────────

export type ProductWithVariants = Product & {
  variants: ProductVariant[];
  category: Category;
  _count?: { reviews: number };
  avgRating?: number;
};

export type ProductWithDetails = Product & {
  variants: ProductVariant[];
  category: Category;
  reviews: ReviewWithUser[];
  _count: { reviews: number };
  avgRating: number;
};

export type ReviewWithUser = Review & {
  user: Pick<User, "id" | "name" | "image">;
};

export type OrderWithItems = Order & {
  items: OrderItemWithDetails[];
  user?: Pick<User, "id" | "name" | "email"> | null;
};

export type OrderItemWithDetails = OrderItem & {
  product: Pick<Product, "id" | "name" | "slug" | "images">;
  variant: Pick<ProductVariant, "id" | "name" | "sku">;
};

export type CollectionWithProducts = Collection & {
  products: {
    sortOrder: number;
    product: ProductWithVariants;
  }[];
};

// ─────────────────────────────────────────────────────────────────────────────
// Cart Types
// ─────────────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string; // Unique cart line ID (productId + variantId)
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  productSlug: string;
  imageUrl: string | null;
  quantity: number;
  unitPrice: number; // SNAPSHOT in pence — must not change after add-to-cart
  compareAt: number | null; // SNAPSHOT for sale display
}

export interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// NextAuth Session Extension
// ─────────────────────────────────────────────────────────────────────────────

export interface ExtendedUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: "CUSTOMER" | "ADMIN";
}

// NextAuth type augmentation lives in types/next-auth.d.ts

// ─────────────────────────────────────────────────────────────────────────────
// Stripe Types
// ─────────────────────────────────────────────────────────────────────────────

export interface CheckoutLineItem {
  variantId: string;
  productId: string;
  quantity: number;
}

export interface CreateCheckoutSessionBody {
  items: CheckoutLineItem[];
  email?: string;
  couponCode?: string;
}

export interface CheckoutSessionResponse {
  url: string;
  sessionId: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Address Types
// ─────────────────────────────────────────────────────────────────────────────

export interface AddressSnapshot {
  firstName: string;
  lastName: string;
  company?: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Filter & Sort Types (Shop page)
// ─────────────────────────────────────────────────────────────────────────────

export type SortOption =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "name-asc";

export interface ShopFilters {
  category?: ProductCategory;
  productType?: ProductType;
  roastLevel?: RoastLevel;
  grind?: GrindType;
  origin?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  sort?: SortOption;
  page?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin Form Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ProductFormValues {
  name: string;
  slug: string;
  shortDescription?: string;
  description: string;
  story?: string;
  categoryId: string;
  category_type: ProductCategory;
  productType: ProductType;
  origin?: string;
  region?: string;
  roastLevel?: RoastLevel;
  flavorNotes: string[];
  brewMethods: string[];
  servingSuggestion?: string;
  featured: boolean;
  active: boolean;
  images: string[];
  metaTitle?: string;
  metaDescription?: string;
  weightGrams?: number;
  variants: VariantFormValues[];
}

export interface VariantFormValues {
  id?: string;
  name: string;
  sku: string;
  price: number; // pence
  compareAt?: number;
  stock: number;
  grind?: GrindType;
  weightGrams?: number;
  isDefault: boolean;
  active: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// API Response Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ApiResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Server Action Return Types
// ─────────────────────────────────────────────────────────────────────────────

export type ActionResult<T = void> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: string };

// Re-export useful Prisma enums for convenience
export type { GrindType, ProductCategory, ProductType, RoastLevel };
