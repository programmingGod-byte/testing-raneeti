import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getUserEventRegistrations } from "@/lib/database-operations"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const registrations = await getUserEventRegistrations(session.user.email)
    return NextResponse.json({ eventIds: registrations })
  } catch (error) {
    console.error("Error fetching user registrations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
