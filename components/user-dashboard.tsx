"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Calendar, ShoppingBag, Trophy, Phone, GraduationCap, LogOut } from "lucide-react"
import type { Session } from "next-auth"
import { signOut } from "next-auth/react"

interface UserDashboardProps {
  session: Session
}

// Define a type for the user data for better type safety
interface UserData {
  name: string;
  email: string;
  phoneNumber: string;
  collegeName: string;
  collegeType?: string;
  registeredEvents: any[]; // Replace 'any' with a proper type if available
  orders: any[]; // Replace 'any' with a proper type if available
  sports: {
    [key: string]: number;
  };
}

export function UserDashboard({ session }: UserDashboardProps) {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user/profile")
      if (response.ok) {
        const data = await response.json()
        setUserData(data)
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black flex items-center justify-center">
        <Card className="max-w-md bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Profile Not Found</CardTitle>
            <CardDescription className="text-slate-400">Please complete your registration first.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => (window.location.href = "/register")} className="bg-rose-600 hover:bg-rose-700">
              Complete Registration
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Welcome, {userData.name}!</h1>
            <p className="text-slate-400">Your RANN-NEETI Dashboard</p>
          </div>
          <Button
            variant="outline"
            onClick={() => signOut()}
            className="border-slate-700 text-white hover:bg-slate-800"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Detailed Information */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-slate-900 border-slate-800">
            <TabsTrigger value="profile" className="text-white data-[state=active]:bg-rose-600">
              Profile
            </TabsTrigger>
            <TabsTrigger value="sports" className="text-white data-[state=active]:bg-rose-600">
              Sports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-400">Full Name</label>
                    <p className="text-lg text-white">{userData.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-400">Email</label>
                    <p className="text-lg text-white">{userData.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-400 flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </label>
                    <p className="text-lg text-white">{userData.phoneNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-400 flex items-center gap-1">
                      <GraduationCap className="w-4 h-4" />
                      College
                    </label>
                    <p className="text-lg text-white">{userData.collegeName}</p>
                    <p className="text-sm text-slate-500">{userData.collegeType}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sports">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Registered Sports Participants</CardTitle>
                <CardDescription className="text-slate-400">Number of participants registered for each sport.</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Check if userData.sports exists and if any sport has participants */}
                {!userData.sports || Object.values(userData.sports).every(count => count === 0) ? (
                  <p className="text-center py-8 text-slate-500">No participants registered for any sports.</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {/* Use Object.entries to map over the sports object */}
                    {Object.entries(userData.sports)
                      // Filter out sports with 0 participants
                      .filter(([, count]) => count > 0)
                      // Map over the filtered sports to display them
                      .map(([sport, count]) => (
                        <div key={sport} className="p-4 bg-slate-800 border border-slate-700 rounded-lg text-center">
                           {/* Format camelCase names like 'badmintonMen' to 'Badminton Men' */}
                           <p className="text-sm font-medium text-slate-400 capitalize">{sport.replace(/([A-Z])/g, ' $1').trim()}</p>
                           <p className="text-2xl font-bold text-white">{count}</p>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  )
}
