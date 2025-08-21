import { NextResponse } from "next/server"
import { getAdminSession } from "@/lib/admin-auth"
import { getAllMerchOrders } from "@/lib/database-operations"

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const orders = await getAllMerchOrders()
    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
