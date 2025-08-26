import type { ObjectId } from "mongodb"


interface SportsParticipants {
  cricket: number;
  badmintonMen: number;
  badmintonWomen: number;
  volleyballMen: number;
  volleyballWomen: number;
  football: number;
  hockey: number;
  basketballMen: number;
  basketballWomen: number;
  tableTennisMen: number;
  tableTennisWomen: number;
  chess: number;
  lawnTennisMen: number;
  lawnTennisWomen: number;
  athletics: number;
}
export interface User {
  _id?: ObjectId
  googleId: string
  email: string
  name: string // This corresponds to the 'leaderName' field from the form
  image?: string
  phoneNumber?: string
  collegeName?: string
  collegeType?: string // Optional: Not in the current form but can be kept
  
  // This nested object holds all the participant counts from the form
  sports?: SportsParticipants 
  
  registeredEvents: ObjectId[] // Array of event registration IDs
  createdAt: Date
  updatedAt: Date
}
