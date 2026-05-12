// ─────────────────────────────────────────────
// Diganta — Next.js Proxy (Route Protection)
// Replaces middleware.js in Next.js 16+
// ─────────────────────────────────────────────

import { NextResponse } from "next/server";

// Public routes that don't require authentication
const PUBLIC_ROUTES = ["/login", "/signup", "/vendor-register"];

// API routes that don't require authentication
const PUBLIC_API_ROUTES = [
  "/api/auth/login",
  "/api/auth/signup",
  "/api/health",
  "/api/vendors/register",
];

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // Skip static files, _next internals, and favicon
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.match(/\.(ico|svg|png|jpg|jpeg|webp|gif|css|js|woff2?)$/)
  ) {
    return NextResponse.next();
  }

  // Allow public API routes
  if (PUBLIC_API_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Allow public page routes
  if (PUBLIC_ROUTES.some((route) => pathname === route)) {
    return NextResponse.next();
  }

  // Allow the root page (it handles its own redirect logic)
  if (pathname === "/") {
    return NextResponse.next();
  }

  // For API routes, check authorization header
  if (pathname.startsWith("/api/")) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // For all other routes (protected pages), let them through
  // Client-side AuthContext handles the redirect if no token
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|uploads/).*)",
  ],
};
