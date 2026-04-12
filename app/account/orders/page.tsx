import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { getUserOrders } from "@/lib/actions/orders";
import { formatPrice, formatDate } from "@/lib/utils";
import { ORDER_STATUS_LABELS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Orders" };

const STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "destructive" | "outline" | "gold"
> = {
  PENDING: "secondary",
  PROCESSING: "default",
  SHIPPED: "gold",
  DELIVERED: "outline",
  CANCELLED: "destructive",
  REFUNDED: "secondary",
};

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const orders = await getUserOrders(session.user.id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Order History</h2>
        <p className="text-sm text-muted-foreground">
          {orders.length} {orders.length === 1 ? "order" : "orders"} total
        </p>
      </div>
      <Separator />

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground/40" />
          <div>
            <p className="font-medium">No orders yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              When you place an order it will appear here.
            </p>
          </div>
          <Button asChild>
            <Link href="/shop">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="rounded-lg border border-border bg-card"
            >
              {/* Order header */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-4 border-b border-border">
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-foreground">
                    {order.orderNumber}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={STATUS_VARIANT[order.status] ?? "secondary"}>
                    {ORDER_STATUS_LABELS[order.status] ?? order.status}
                  </Badge>
                  <span className="text-sm font-semibold">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>

              {/* Items */}
              <ul className="divide-y divide-border">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.productSlug}`}
                        className="text-sm font-medium hover:underline line-clamp-1"
                      >
                        {item.productName}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {item.variantName} · Qty {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium shrink-0">
                      {formatPrice(item.total)}
                    </p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
