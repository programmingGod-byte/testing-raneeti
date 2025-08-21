import type { ObjectId } from "mongodb"

export interface Event {
  _id?: ObjectId
  title: string
  description: string
  image: string
  prizePool: string
  venue: string
  time: string
  date: string
  registrations: ObjectId[]
  createdAt: Date
  updatedAt: Date
}

export interface EventRegistration {
  _id?: ObjectId
  eventId: ObjectId
  userId: ObjectId
  userName: string
  userEmail: string
  phoneNumber: string
  collegeName: string
  sportsToPlay: string[]
  registeredAt: Date
}
