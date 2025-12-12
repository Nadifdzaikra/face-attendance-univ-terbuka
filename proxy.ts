import { NextResponse, type NextRequest } from "next/server";

// Protect dashboard and attendance routes
export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // allow next internal routes, static files, api, and public
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/public") ||
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
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
