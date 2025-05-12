import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Replace this with the same secret used in your NestJS backend
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_TOKEN!); // ⚠️ Secure this in production

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token");

  const pathname = request.nextUrl.pathname;

  // Redirect unauthenticated users trying to access /dashboard
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (token) {
    try {
      const { payload } = await jwtVerify(token.value, JWT_SECRET, {
        algorithms: ["HS256"],
      });

      const userRole = payload.role;

      // Role-based protection
      if (
        (userRole === "ADMIN" &&
          !pathname.startsWith("/dashboard/adminPage")) ||
        (userRole === "LECTURER" &&
          !pathname.startsWith("/dashboard/lecturerPage")) ||
        (userRole === "STUDENT" &&
          !pathname.startsWith("/dashboard/studentPage"))
      ) {
        return NextResponse.redirect(new URL("/auth", request.url));
      }

      // User is allowed
      return NextResponse.next();
    } catch (err) {
      console.error("JWT verification failed:", err);
      return NextResponse.redirect(new URL("/auth", request.url));
    }
  }

  // Default allow
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
