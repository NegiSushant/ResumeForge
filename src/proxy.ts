import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value;

  const pathname = request.nextUrl.pathname;
  const isProtected =
    pathname.startsWith("/analyze") || pathname.startsWith("/history");

  if (isProtected && !sessionToken) {
    const signInUrl = new URL("/signin", request.nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: ["/analyze", "/analyze/:path*", "/history", "/history/:path*"],
};
