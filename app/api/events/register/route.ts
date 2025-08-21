import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { registerUserForEvent, unregisterUserFromEvent } from "@/lib/database-operations"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { eventId } = await request.json()
    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 })
    }

    await registerUserForEvent(session.user.email, eventId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error registering for event:", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { eventId } = await request.json()
    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 })
    }

    await unregisterUserFromEvent(session.user.email, eventId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error unregistering from event:", error)
    return NextResponse.json({ error: "Unregistration failed" }, { status: 500 })
  }
}
