import { NextResponse } from "next/server"
import { getAdminSession } from "@/lib/admin-auth"
import { getAllUsers } from "@/lib/database-operations"

// Single source of truth for all sports-related data.
// 'key' must match the property name in the database/schema.
// 'header' is the user-friendly column name for the CSV file.
const sportsConfig = [
  { key: 'cricket', header: 'Cricket' },
  { key: 'football', header: 'Football' },
  { key: 'hockey', header: 'Hockey' },
  { key: 'chess', header: 'Chess' },
  { key: 'volleyballMen', header: '"Volleyball (Men)"' },
  { key: 'volleyballWomen', header: '"Volleyball (Women)"' },
  { key: 'basketballMen', header: '"Basketball (Men)"' },
  { key: 'basketballWomen', header: '"Basketball (Women)"' },
  { key: 'badmintonMen', header: '"Badminton (Men)"' },
  { key: 'badmintonWomen', header: '"Badminton (Women)"' },
  { key: 'tableTennisMen', header: '"Table Tennis (Men)"' },
  { key: 'tableTennisWomen', header: '"Table Tennis (Women)"' },
  { key: 'lawnTennisMen', header: '"Lawn Tennis (Men)"' },
  { key: 'lawnTennisWomen', header: '"Lawn Tennis (Women)"' },
  { key: 'squashMen', header: '"Squash (Men)"' },
  { key: 'squashWomen', header: '"Squash (Women)"' },
  { key: 'athleticsMen', header: '"Athletics (Men)"' },
  { key: 'athleticsWomen', header: '"Athletics (Women)"' },
  { key: 'esportsMen', header: '"Esports (Men)"' },
  { key: 'esportsWomen', header: '"Esports (Women)"' },
];

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const allUsers = await getAllUsers()

    // Dynamically generate sport headers from the config array
    const sportHeaders = sportsConfig.map(sport => sport.header).join(",")
    
    const csvHeaders = `Name,Email,Phone,College,${sportHeaders}\n`

    const csvData = allUsers
      .map((user) => {
        // Helper function to escape commas and quotes for CSV compatibility
        const escape = (str: string | undefined | null) => `"${(str || '').replace(/"/g, '""')}"`;

        const sports = user.sports || {};

        // Dynamically generate sport values in the correct order using the config array
        const sportValues = sportsConfig.map(sportConfigItem => {
          // Use bracket notation to access property via the key from our config
          return sports[sportConfigItem.key] || 0;
        });

        const userData = [
          escape(user.name),
          escape(user.email),
          escape(user.phoneNumber),
          escape(user.collegeName),
        ];

        // Combine user data with the dynamic sport counts
        return [...userData, ...sportValues].join(",")
      })
      .join("\n")

    const csv = csvHeaders + csvData

    return new NextResponse(csv, {
      status: 200,
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