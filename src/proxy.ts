import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

// First line of defence for the admin area. Every admin page and server action
// also re-checks the session against the database (see requireAdmin).
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);

  // Password recovery pages must be reachable while signed out.
  if (pathname === "/admin/forgot-password" || pathname === "/admin/reset-password") {
    return NextResponse.next();
  }

  if (pathname === "/admin/login") {
    if (!session) return NextResponse.next();
    const next = request.nextUrl.searchParams.get("next");
    return NextResponse.redirect(new URL(next && /^\/(?![\/\\])/.test(next) ? next : "/admin", request.url));
  }

  if (!session) {
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
