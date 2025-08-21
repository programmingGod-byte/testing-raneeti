import { type NextRequest, NextResponse } from "next/server"
import { getAdminSession } from "@/lib/admin-auth"
import { createMerch, getAllMerch } from "@/lib/database-operations"

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const merch = await getAllMerch()
    return NextResponse.json(merch)
  } catch (error) {
    console.error("Error fetching merch:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const merchData = await request.json()
    const result = await createMerch(merchData)

    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    console.error("Error creating merch:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
