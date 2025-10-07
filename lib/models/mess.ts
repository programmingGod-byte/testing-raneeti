import type { ObjectId } from "mongodb"


export interface collegeStudent{
    _id?: string | ObjectId,
    phone: string,
}

export interface Mess {
  _id?: string | ObjectId,
  times: Date[],
  phone : string,
}
