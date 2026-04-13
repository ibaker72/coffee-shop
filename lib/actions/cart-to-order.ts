import type Stripe from "stripe";
import { db } from "@/lib/db";

export interface OrderItemInput {
  productId: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  total: number;
  productName: string;
  variantName: string;
  productImage: string | null;
  productSlug: string;
}

/**
 * Build order item records from a Stripe Checkout session's line items.
 *
 * Stripe line items carry productId/variantId in product_data.metadata.
 * We re-fetch from DB for authoritative name/image snapshots.
 * A single batched query prevents N+1.
 */
export async function buildOrderItems(
  lineItems: Stripe.LineItem[]
): Promise<OrderItemInput[]> {
  // Extract variantIds and capture Stripe prices/quantities in one pass
  const variantIds: string[] = [];
  const lineItemByVariant = new Map<
    string,
    { quantity: number; unitPrice: number }
  >();

  for (const item of lineItems) {
    const productData = item.price?.product;
    if (!productData || typeof productData === "string") continue;

    const meta = (productData as Stripe.Product).metadata ?? {};
    const { variantId } = meta;
    if (!variantId) continue;

    variantIds.push(variantId);
    lineItemByVariant.set(variantId, {
      quantity: item.quantity ?? 1,
      unitPrice: item.price?.unit_amount ?? 0,
    });
  }

  if (!variantIds.length) return [];

  const variants = await db.productVariant.findMany({
    where: { id: { in: variantIds } },
    include: {
      product: {
        select: { id: true, name: true, slug: true, images: true },
      },
    },
  });

  return variants.flatMap((variant) => {
    const li = lineItemByVariant.get(variant.id);
    if (!li) return [];

    return [
      {
        productId: variant.productId,
        variantId: variant.id,
        quantity: li.quantity,
        unitPrice: li.unitPrice,
        total: li.unitPrice * li.quantity,
        productName: variant.product.name,
        variantName: variant.name,
        productImage: variant.product.images[0] ?? null,
        productSlug: variant.product.slug,
      },
    ];
  });
}
