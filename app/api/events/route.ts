import { NextResponse } from "next/server"
import { getAllEvents } from "@/lib/database-operations"

export async function GET() {
  try {
    const events = await getAllEvents()
    return NextResponse.json(events)
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
