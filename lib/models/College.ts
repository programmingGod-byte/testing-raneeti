import type { ObjectId } from "mongodb"

export interface College {
  _id?: ObjectId
  name: string
  type: string
  createdAt: Date
  updatedAt: Date
}
