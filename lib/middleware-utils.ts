import { type NextRequest, NextResponse } from "next/server"
import { verifyAdminSession } from "./admin-auth"

export async function requireAdminAuth(request: NextRequest): Promise<NextResponse | null> {
  const token = request.cookies.get("admin-session")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  const session = await verifyAdminSession(token)
  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  return null // Continue to the protected route
}
