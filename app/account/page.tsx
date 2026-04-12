import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Profile" };

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  // Layout already guards this; session is guaranteed here
  if (!session?.user?.id) return null;

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      role: true,
      _count: { select: { orders: true } },
    },
  });

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Profile</h2>
        <p className="text-sm text-muted-foreground">
          Your account details.
        </p>
      </div>
      <Separator />

      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ProfileField label="Full Name" value={user.name ?? "—"} />
        <ProfileField label="Email" value={user.email} />
        <ProfileField
          label="Member Since"
          value={formatDate(user.createdAt)}
        />
        <ProfileField
          label="Total Orders"
          value={String(user._count.orders)}
        />
        <ProfileField
          label="Account Type"
          value={user.role === "ADMIN" ? "Administrator" : "Customer"}
        />
      </dl>
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}
