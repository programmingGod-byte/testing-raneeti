import type { ObjectId } from "mongodb"

export interface Merch {
  _id?: ObjectId
  title: string
  description: string
  images: string[]
  sizes: string[]
  price: number
  createdAt: Date
  updatedAt: Date
}
