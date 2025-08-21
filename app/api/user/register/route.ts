import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getUserByEmail, updateUser } from "@/lib/database-operations"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, phoneNumber, collegeName, collegeType, sportsToPlay } = await request.json()

    if (!name || !phoneNumber || !collegeName || !sportsToPlay || sportsToPlay.length === 0) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Get user from database
    const user = await getUserByEmail(session.user.email)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Update user with registration details
    await updateUser(user._id!.toString(), {
      name,
      phoneNumber,
      collegeName,
      collegeType,
      sportsToPlay, // Re-add sportsToPlay to be saved
    })

    return NextResponse.json({ success: true, message: "Registration completed successfully" })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
