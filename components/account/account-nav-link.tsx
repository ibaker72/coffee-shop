"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface AccountNavLinkProps {
  href: string;
  label: string;
}

export function AccountNavLink({ href, label }: AccountNavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-muted text-espresso"
          : "text-foreground/70 hover:bg-muted hover:text-foreground"
      )}
    >
      {label}
    </Link>
  );
}
