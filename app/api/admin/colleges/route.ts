import { type NextRequest, NextResponse } from "next/server"
import { getAdminSession } from "@/lib/admin-auth"
import { createCollege, getAllColleges } from "@/lib/database-operations"

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const colleges = await getAllColleges()
    return NextResponse.json(colleges)
  } catch (error) {
    console.error("Error fetching colleges:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const collegeData = await request.json()
    const result = await createCollege(collegeData)

    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    console.error("Error creating college:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
