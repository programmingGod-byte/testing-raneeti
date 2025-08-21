import { getDatabase } from "./mongodb"
import type { Event, EventRegistration } from "./models/Event"
import type { Merch } from "./models/Merch"
import type { College } from "./models/College"
import type { User } from "./models/User"
import { ObjectId } from "mongodb"

// Event operations
export async function createEvent(event: Omit<Event, "_id" | "registrations" | "createdAt" | "updatedAt">) {
  const db = await getDatabase()
  const result = await db.collection<Event>("events").insertOne({
    ...event,
    registrations: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  return result
}

export async function getAllEvents() {
  const db = await getDatabase()
  return await db.collection<Event>("events").find({}).toArray()
}

export async function getEventById(id: string) {
  const db = await getDatabase()
  return await db.collection<Event>("events").findOne({ _id: new ObjectId(id) })
}

export async function updateEvent(id: string, updates: Partial<Event>) {
  const db = await getDatabase()
  return await db
    .collection<Event>("events")
    .updateOne({ _id: new ObjectId(id) }, { $set: { ...updates, updatedAt: new Date() } })
}

export async function deleteEvent(id: string) {
  const db = await getDatabase()
  return await db.collection<Event>("events").deleteOne({ _id: new ObjectId(id) })
}

// Merch operations
export async function createMerch(merch: Omit<Merch, "_id" | "createdAt" | "updatedAt">) {
  const db = await getDatabase()
  const result = await db.collection<Merch>("merch").insertOne({
    ...merch,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  return result
}

export async function getAllMerch() {
  const db = await getDatabase()
  return await db.collection<Merch>("merch").find({}).toArray()
}

export async function updateMerch(id: string, updates: Partial<Merch>) {
  const db = await getDatabase()
  return await db
    .collection<Merch>("merch")
    .updateOne({ _id: new ObjectId(id) }, { $set: { ...updates, updatedAt: new Date() } })
}

export async function deleteMerch(id: string) {
  const db = await getDatabase()
  return await db.collection<Merch>("merch").deleteOne({ _id: new ObjectId(id) })
}

// College operations
export async function createCollege(college: Omit<College, "_id" | "createdAt" | "updatedAt">) {
  const db = await getDatabase()
  const result = await db.collection<College>("colleges").insertOne({
    ...college,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  return result
}

export async function getAllColleges() {
  const db = await getDatabase()
  return await db.collection<College>("colleges").find({}).toArray()
}

export async function updateCollege(id: string, updates: Partial<College>) {
  const db = await getDatabase()
  return await db
    .collection<College>("colleges")
    .updateOne({ _id: new ObjectId(id) }, { $set: { ...updates, updatedAt: new Date() } })
}

export async function deleteCollege(id: string) {
  const db = await getDatabase()
  return await db.collection<College>("colleges").deleteOne({ _id: new ObjectId(id) })
}

// User operations
export async function createUser(user: Omit<User, "_id" | "registeredEvents" | "createdAt" | "updatedAt">) {
  const db = await getDatabase()
  const result = await db.collection<User>("users").insertOne({
    ...user,
    registeredEvents: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  return result
}

export async function getUserByGoogleId(googleId: string) {
  const db = await getDatabase()
  return await db.collection<User>("users").findOne({ googleId })
}

export async function getUserByEmail(email: string) {
  const db = await getDatabase()
  return await db.collection<User>("users").findOne({ email })
}

export async function updateUser(id: string, updates: Partial<User>) {
  const db = await getDatabase()
  return await db
    .collection<User>("users")
    .updateOne({ _id: new ObjectId(id) }, { $set: { ...updates, updatedAt: new Date() } })
}

// Event registration operations
export async function registerForEvent(registration: Omit<EventRegistration, "_id" | "registeredAt">) {
  const db = await getDatabase()
  const result = await db.collection<EventRegistration>("event_registrations").insertOne({
    ...registration,
    registeredAt: new Date(),
  })

  // Update event registrations count
  await db
    .collection<Event>("events")
    .updateOne({ _id: registration.eventId }, { $push: { registrations: result.insertedId } })

  return result
}

export async function getEventRegistrations(eventId: string) {
  const db = await getDatabase()
  return await db
    .collection<EventRegistration>("event_registrations")
    .find({ eventId: new ObjectId(eventId) })
    .toArray()
}

export async function getUserRegistrations(userId: string) {
  const db = await getDatabase()
  return await db
    .collection<EventRegistration>("event_registrations")
    .find({ userId: new ObjectId(userId) })
    .toArray()
}

// New functions for event registration, merch orders, and user profile management
export async function registerUserForEvent(userEmail: string, eventId: string) {
  const db = await getDatabase()

  // Check if user is already registered
  const existingRegistration = await db.collection("event_registrations").findOne({
    userEmail,
    eventId: new ObjectId(eventId),
  })

  if (existingRegistration) {
    throw new Error("User already registered for this event")
  }

  // Create registration
  const result = await db.collection("event_registrations").insertOne({
    userEmail,
    eventId: new ObjectId(eventId),
    registeredAt: new Date(),
  })

  // Update event registrations array
  await db
    .collection<Event>("events")
    .updateOne({ _id: new ObjectId(eventId) }, { $push: { registrations: result.insertedId } })

  return result
}

export async function unregisterUserFromEvent(userEmail: string, eventId: string) {
  const db = await getDatabase()

  // Find and remove registration
  const registration = await db.collection("event_registrations").findOne({
    userEmail,
    eventId: new ObjectId(eventId),
  })

  if (!registration) {
    throw new Error("Registration not found")
  }

  await db.collection("event_registrations").deleteOne({
    userEmail,
    eventId: new ObjectId(eventId),
  })

  // Remove from event registrations array
  await db
    .collection<Event>("events")
    .updateOne({ _id: new ObjectId(eventId) }, { $pull: { registrations: registration._id } })

  return true
}

export async function getUserEventRegistrations(userEmail: string) {
  const db = await getDatabase()
  const registrations = await db.collection("event_registrations").find({ userEmail }).toArray()
  return registrations.map((reg) => reg.eventId.toString())
}

export async function createMerchOrder(userEmail: string, merchId: string, size: string) {
  const db = await getDatabase()

  // Get merch details
  const merch = await db.collection<Merch>("merch").findOne({ _id: new ObjectId(merchId) })
  if (!merch) {
    throw new Error("Merchandise not found")
  }

  const order = {
    userEmail,
    merchId: new ObjectId(merchId),
    title: merch.title,
    size,
    price: merch.price,
    status: "pending",
    orderDate: new Date(),
  }

  return await db.collection("merch_orders").insertOne(order)
}

export async function getUserProfile(userEmail: string) {
  const db = await getDatabase()

  // Get user data
  const user = await db.collection<User>("users").findOne({ email: userEmail })
  if (!user) {
    return null
  }

  // Get registered events
  const eventRegistrations = await db.collection("event_registrations").find({ userEmail }).toArray()
  const eventIds = eventRegistrations.map((reg) => reg.eventId)
  const registeredEvents = await db
    .collection<Event>("events")
    .find({
      _id: { $in: eventIds },
    })
    .toArray()

  // Get orders
  const orders = await db.collection("merch_orders").find({ userEmail }).toArray()

  return {
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    collegeName: user.collegeName,
    collegeType: user.collegeType,
    sportsToPlay: user.sportsToPlay,
    registeredEvents,
    orders,
  }
}

export async function getAllEventRegistrations() {
  const db = await getDatabase()

  // Get all registrations with user and event details
  const registrations = await db
    .collection("event_registrations")
    .aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userEmail",
          foreignField: "email",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "event",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $unwind: "$event",
      },
    ])
    .toArray()

  return registrations
}

export async function getAllMerchOrders() {
  const db = await getDatabase()

  // Get all orders with user details
  const orders = await db
    .collection("merch_orders")
    .aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userEmail",
          foreignField: "email",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
    ])
    .toArray()

  return orders
}
