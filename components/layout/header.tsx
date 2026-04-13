"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, User, Search, LogOut, Settings } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { useCartStore } from "@/stores/cart-store";
import { useUIStore } from "@/stores/ui-store";
import { NAV_LINKS, BRAND_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Header() {
  const pathname = usePathname();
  const { openDrawer, itemCount } = useCartStore();
  const { toggleMobileNav } = useUIStore();
  const { data: session, status } = useSession();
  const count = itemCount();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        {/* Mobile menu trigger */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={toggleMobileNav}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo / Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-xl font-semibold text-espresso"
        >
          {BRAND_NAME}
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
          {NAV_LINKS.map((link) => {
            const hasChildren =
              "children" in link && link.children && link.children.length > 0;
            const isActive =
              pathname === link.href ||
              ("children" in link &&
                link.children?.some((c) => pathname === c.href));

            return (
              <div key={link.href} className="relative group">
                <Link
                  href={link.href}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                    isActive
                      ? "text-espresso"
                      : "text-foreground/80 hover:text-foreground"
                  )}
                >
                  {link.label}
                  {hasChildren && (
                    <svg
                      className="h-3 w-3 transition-transform group-hover:rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </Link>

                {hasChildren && (
                  <div className="absolute left-0 top-full z-50 hidden min-w-[180px] rounded-md border border-border bg-background p-1 shadow-lg group-hover:block animate-fade-in">
                    {"children" in link &&
                      link.children?.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "block rounded-sm px-3 py-2 text-sm transition-colors hover:bg-muted",
                            pathname === child.href
                              ? "font-medium text-espresso"
                              : "text-foreground/80"
                          )}
                        >
                          {child.label}
                        </Link>
                      ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search"
            className="hidden sm:flex"
            asChild
          >
            <Link href="/shop">
              <Search className="h-5 w-5" />
            </Link>
          </Button>

          {/* User menu — session aware */}
          {status === "loading" ? (
            <div className="h-10 w-10 rounded-md bg-muted animate-pulse" />
          ) : status === "authenticated" && session?.user ? (
            <UserMenu user={session.user} />
          ) : (
            <Button variant="ghost" size="icon" aria-label="Sign in" asChild>
              <Link href="/auth/sign-in">
                <User className="h-5 w-5" />
              </Link>
            </Button>
          )}

          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Cart (${count} items)`}
            onClick={openDrawer}
            className="relative"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <Badge
                variant="gold"
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px] font-bold"
              >
                {count > 99 ? "99+" : count}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}

// ── User menu dropdown ────────────────────────────────────────────────────────

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

function UserMenu({ user }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-muted transition-colors"
        aria-label="Account menu"
        aria-expanded={open}
      >
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name ?? "Account"}
            width={28}
            height={28}
            className="rounded-full"
          />
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-espresso text-espresso-foreground text-xs font-semibold">
            {(user.name ?? user.email ?? "U").charAt(0).toUpperCase()}
          </div>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-52 rounded-md border border-border bg-background p-1 shadow-lg animate-fade-in">
          {/* Identity */}
          <div className="px-3 py-2 border-b border-border mb-1">
            {user.name && (
              <p className="text-sm font-medium truncate">{user.name}</p>
            )}
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>

          <Link
            href="/account"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-muted transition-colors"
          >
            <Settings className="h-4 w-4 text-muted-foreground" />
            My Account
          </Link>
          <Link
            href="/account/orders"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-muted transition-colors"
          >
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            My Orders
          </Link>

          <div className="border-t border-border mt-1 pt-1">
            <button
              onClick={() => {
                setOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
