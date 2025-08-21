import { NextResponse } from "next/server"
import { getAdminSession } from "@/lib/admin-auth"
import { getAllEventRegistrations } from "@/lib/database-operations"

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const registrations = await getAllEventRegistrations()
    console.log(registrations)

    // Convert to CSV format
    const csvHeaders = "Event,User Name,Email,Phone,College,Sports,Registration Date\n"
    const csvData = registrations
      .map((reg) => {
        const user = reg.user
        const event = reg.event
        return [
          event.title,
          user.name,
          user.email,
          user.phoneNumber,
          user.collegeName,
          (user.sportsToPlay || []).join("; "), // Keep the defensive check
          new Date(reg.registeredAt).toLocaleDateString(),
        ].join(",")
      })
      .join("\n")

    const csv = csvHeaders + csvData

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=event-registrations.csv",
      },
    })
  } catch (error) {
    console.error("Error exporting registrations:", error)
    return NextResponse.json({ error: "Export failed" }, { status: 500 })
  }
}
