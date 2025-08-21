import { type NextRequest, NextResponse } from "next/server"
import { getAdminSession } from "@/lib/admin-auth"
import { updateMerch, deleteMerch } from "@/lib/database-operations"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const updates = await request.json()
    await updateMerch(params.id, updates)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating merch:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await deleteMerch(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting merch:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
