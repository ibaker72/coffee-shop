import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AccountNavLink } from "@/components/account/account-nav-link";

export const metadata: Metadata = {
  title: { template: "%s | Account — Qahwa & Co", default: "Account" },
};

const NAV = [
  { href: "/account", label: "Profile" },
  { href: "/account/orders", label: "Orders" },
] as const;

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/sign-in?callbackUrl=/account");
  }

  return (
    <div className="container py-8 lg:py-12">
      <h1 className="font-display text-2xl font-semibold text-espresso mb-6">
        My Account
      </h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar nav */}
        <aside className="w-full lg:w-48 shrink-0">
          <nav className="flex flex-row lg:flex-col gap-1">
            {NAV.map(({ href, label }) => (
              <AccountNavLink key={href} href={href} label={label} />
            ))}
          </nav>
        </aside>

        {/* Page content */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
