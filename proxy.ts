import { NextResponse, type NextRequest } from "next/server";

// Protect dashboard and attendance routes
export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // allow next internal routes, static files, api, public, dan docs
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/public") ||
    pathname.startsWith("/swagger") ||
    pathname.startsWith("/api-docs") ||
    pathname.startsWith("/docs") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // protect dashboard and attendance paths
  if (pathname.startsWith("/dashboard")) {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // redirect login/register to dashboard if already have token
  if ((pathname === "/login" || pathname === "/register")) {
    const token = req.cookies.get("token")?.value;
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/swagger/:path*", "/api-docs/:path*", "/docs/:path*", "/auth/login"],
};