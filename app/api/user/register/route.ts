import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getUserByEmail, updateUser } from "@/lib/database-operations"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // 1. Check for a valid user session
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 2. Destructure the request body according to the new form structure
    const { leaderName, phoneNumber, collegeName, sports } = await request.json()

    // 3. Validate the incoming data
    if (!leaderName || !phoneNumber || !collegeName || !sports) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // 4. Get the user from the database
    const user = await getUserByEmail(session.user.email)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // 5. Update the user document with the new data structure
    // Note: 'leaderName' from the form maps to the 'name' field in the User schema
    await updateUser(user._id!.toString(), {
      name: leaderName,
      phoneNumber,
      collegeName,
      sports, // The nested object with participant counts is saved directly
    })

    return NextResponse.json({ success: true, message: "Registration completed successfully" })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
