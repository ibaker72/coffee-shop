"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useUIStore } from "@/stores/ui-store";
import { NAV_LINKS, BRAND_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

export function MobileNav() {
  const { isMobileNavOpen, closeMobileNav } = useUIStore();
  const pathname = usePathname();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  return (
    <Sheet
      open={isMobileNavOpen}
      onOpenChange={(open) => !open && closeMobileNav()}
    >
      <SheetContent side="left" className="flex flex-col w-72">
        <SheetHeader>
          <SheetTitle className="font-display text-xl text-espresso">
            {BRAND_NAME}
          </SheetTitle>
        </SheetHeader>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
            {NAV_LINKS.map((link) => {
              const hasChildren =
                "children" in link && link.children && link.children.length > 0;
              const isExpanded = expandedItem === link.label;

              return (
                <li key={link.href}>
                  {hasChildren ? (
                    <>
                      <button
                        onClick={() =>
                          setExpandedItem(isExpanded ? null : link.label)
                        }
                        className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                      >
                        {link.label}
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 text-muted-foreground transition-transform duration-200",
                            isExpanded && "rotate-180"
                          )}
                        />
                      </button>
                      {isExpanded && (
                        <ul className="ml-4 mt-1 space-y-1 border-l border-border pl-4">
                          {"children" in link &&
                            link.children?.map((child) => (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  onClick={closeMobileNav}
                                  className={cn(
                                    "block rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted",
                                    pathname === child.href
                                      ? "font-medium text-espresso"
                                      : "text-muted-foreground"
                                  )}
                                >
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={closeMobileNav}
                      className={cn(
                        "block rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted",
                        pathname === link.href
                          ? "text-espresso bg-muted"
                          : "text-foreground"
                      )}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-border pt-4 space-y-2">
          <Separator className="mb-4" />
          <Link
            href="/account"
            onClick={closeMobileNav}
            className="block rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            My Account
          </Link>
          <Link
            href="/auth/sign-in"
            onClick={closeMobileNav}
            className="block rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Sign In
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
