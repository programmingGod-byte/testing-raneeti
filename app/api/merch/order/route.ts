import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createMerchOrder } from "@/lib/database-operations"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { merchId, size } = await request.json()
    if (!merchId || !size) {
      return NextResponse.json({ error: "Merch ID and size are required" }, { status: 400 })
    }

    await createMerchOrder(session.user.email, merchId, size)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Order failed" }, { status: 500 })
  }
}
