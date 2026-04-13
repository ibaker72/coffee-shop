import { db } from "@/lib/db";
import type { OrderWithItems } from "@/types";

/**
 * Fetch a user's orders, newest first.
 * Called from server components only — not a server action.
 */
export async function getUserOrders(userId: string): Promise<OrderWithItems[]> {
  const orders = await db.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      items: {
        include: {
          product: {
            select: { id: true, name: true, slug: true, images: true },
          },
          variant: {
            select: { id: true, name: true, sku: true },
          },
        },
      },
    },
  });

  return orders as unknown as OrderWithItems[];
}
