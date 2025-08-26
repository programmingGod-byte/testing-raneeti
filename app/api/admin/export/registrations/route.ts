import { NextResponse } from "next/server"
import { getAdminSession } from "@/lib/admin-auth"
import { getAllUsers } from "@/lib/database-operations" // We only need getAllUsers for this operation

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const allUsers = await getAllUsers()

    // Define specific headers for each sport, wrapping those with commas in quotes
    const sportHeaders = [
      "Cricket", '"Badminton (Men)"', '"Badminton (Women)"', '"Volleyball (Men)"', '"Volleyball (Women)"',
      "Football", "Hockey", '"Basketball (Men)"', '"Basketball (Women)"', '"Table Tennis (Men)"',
      '"Table Tennis (Women)"', "Chess", '"Lawn Tennis (Men)"', '"Lawn Tennis (Women)"', "Athletics"
    ];
    
    const csvHeaders = `Name,Email,Phone,College,${sportHeaders.join(",")}\n`

    const csvData = allUsers
      .map((user) => {
        // Helper function to escape commas within fields to maintain CSV integrity
        const escape = (str: string | undefined | null) => `"${(str || '').replace(/"/g, '""')}"`;

        // Safely access sports data, providing a default of 0 if not present
        const sports = user.sports || {};
        const sportValues = [
          sports.cricket || 0,
          sports.badmintonMen || 0,
          sports.badmintonWomen || 0,
          sports.volleyballMen || 0,
          sports.volleyballWomen || 0,
          sports.football || 0,
          sports.hockey || 0,
          sports.basketballMen || 0,
          sports.basketballWomen || 0,
          sports.tableTennisMen || 0,
          sports.tableTennisWomen || 0,
          sports.chess || 0,
          sports.lawnTennisMen || 0,
          sports.lawnTennisWomen || 0,
          sports.athletics || 0,
        ];

        const userData = [
          escape(user.name),
          escape(user.email),
          escape(user.phoneNumber),
          escape(user.collegeName),
        ];

        // Combine user data with the individual sport counts
        return [...userData, ...sportValues].join(",")
      })
      .join("\n")

    const csv = csvHeaders + csvData

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=user-registrations-detailed.csv",
      },
    })
  } catch (error) {
    console.error("Error exporting user registrations:", error)
    return NextResponse.json({ error: "Export failed" }, { status: 500 })
  }
}
