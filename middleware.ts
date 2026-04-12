import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware — Phase 1 scaffold.
 *
 * Responsibilities:
 *  1. Admin route guard: redirects unauthenticated requests away from /admin/*.
 *     Full role-based check (JWT decode) will be wired once next-auth is
 *     configured in Phase 2.
 *
 *  2. next-intl locale handling: the next-intl plugin (next.config.ts) handles
 *     translation loading; locale-routing middleware will be added in Phase 2
 *     if URL-based locale switching is needed.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Admin guard ─────────────────────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    const sessionToken =
      request.cookies.get("next-auth.session-token") ??
      request.cookies.get("__Secure-next-auth.session-token");

    if (!sessionToken) {
      const signInUrl = new URL("/auth/sign-in", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next (Next.js internals)
     * - static files (images, fonts, etc.)
     * - favicon.ico
     */
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf|eot|css|js)$).*)",
  ],
};
