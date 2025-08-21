import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getAllMerchOrders } from "@/lib/database-operations"
import * as XLSX from "xlsx"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const orders = await getAllMerchOrders()

    // Prepare data for Excel export
    const exportData = orders.map((order) => ({
      "Order ID": order._id.toString(),
      "Item Name": order.title,
      "Customer Name": order.user.name,
      "Customer Email": order.user.email,
      "Phone Number": order.user.phoneNumber || "N/A",
      College: order.user.collegeName,
      Size: order.size,
      Price: `₹${order.price}`,
      Status: order.status,
      "Order Date": new Date(order.orderDate).toLocaleDateString(),
    }))

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(exportData)

    // Auto-size columns
    const colWidths = [
      { wch: 15 }, // Order ID
      { wch: 25 }, // Item Name
      { wch: 20 }, // Customer Name
      { wch: 30 }, // Customer Email
      { wch: 15 }, // Phone Number
      { wch: 25 }, // College
      { wch: 10 }, // Size
      { wch: 10 }, // Price
      { wch: 12 }, // Status
      { wch: 15 }, // Order Date
    ]
    worksheet["!cols"] = colWidths

    XLSX.utils.book_append_sheet(workbook, worksheet, "Merchandise Orders")

    // Generate Excel buffer
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" })

    // Return Excel file
    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="RANN-NEETI-Merchandise-Orders-${new Date().toISOString().split("T")[0]}.xlsx"`,
      },
    })
  } catch (error) {
    console.error("Error exporting merchandise orders:", error)
    return NextResponse.json({ error: "Failed to export merchandise orders" }, { status: 500 })
  }
}
