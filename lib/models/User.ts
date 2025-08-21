import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  googleId: string
  email: string
  name: string
  image?: string
  phoneNumber?: string
  collegeName?: string
  collegeType?: string
  sportsToPlay?: string[] // Add this line
  registeredEvents: ObjectId[] // Array of event registration IDs
  createdAt: Date
  updatedAt: Date
}
