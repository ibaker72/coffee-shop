import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware — Phase 3 update.
 *
 * Guards /admin and /account with a cookie-presence check (lightweight).
 * Full JWT validation happens server-side in route handlers/layouts via
 * getServerSession(authOptions).
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionToken =
    request.cookies.get("next-auth.session-token") ??
    request.cookies.get("__Secure-next-auth.session-token");

  // ── Account guard ────────────────────────────────────────────────────────────
  if (pathname.startsWith("/account")) {
    if (!sessionToken) {
      const url = new URL("/auth/sign-in", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  // ── Admin guard ──────────────────────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (!sessionToken) {
      const url = new URL("/auth/sign-in", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf|eot|css|js)$).*)",
  ],
};
