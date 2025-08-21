import { NextResponse } from "next/server"
import { getAllMerch } from "@/lib/database-operations"

export async function GET() {
  try {
    const merch = await getAllMerch()
    return NextResponse.json(merch)
  } catch (error) {
    console.error("Error fetching merch:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
