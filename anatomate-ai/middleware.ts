import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth0 } from "./lib/auth0";

const unprotectedRoutes = ["/auth/login", "/auth/callback", "/login"];

export async function middleware(request: NextRequest) {
  // Check if the requested path matches any protected route
  const isUnprotectedRoute = unprotectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (!isUnprotectedRoute) {
    try {
      // Verify the session
      const session = await auth0.getSession(request);

      if (!session) {
        // If no session exists, redirect to login
        const loginUrl = new URL("/auth/login", request.url);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      // If there's an error verifying the session, redirect to login
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("returnTo", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Continue with the default Auth0 middleware for all routes
  return await auth0.middleware(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
