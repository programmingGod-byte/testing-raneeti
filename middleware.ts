import { type NextRequest, NextResponse } from "next/server"
import { requireAdminAuth } from "./lib/middleware-utils"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect admin routes (except login page)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const authResponse = await requireAdminAuth(request)
    if (authResponse) {
      return authResponse
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
