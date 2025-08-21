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

interface UserData {
  name: string
  email: string
  phoneNumber: string
  collegeName: string
  collegeType: string
  sportsToPlay: string[]
  registeredEvents: any[]
  orders: any[]
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

        {/* Profile Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Events Registered</CardTitle>
              <Calendar className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-rose-500">{userData.registeredEvents?.length || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Sports Selected</CardTitle>
              <Trophy className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-rose-500">{userData.sportsToPlay?.length || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Orders Placed</CardTitle>
              <ShoppingBag className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-rose-500">{userData.orders?.length || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-900 border-slate-800">
            <TabsTrigger value="profile" className="text-white data-[state=active]:bg-rose-600">
              Profile
            </TabsTrigger>
            <TabsTrigger value="events" className="text-white data-[state=active]:bg-rose-600">
              My Events
            </TabsTrigger>
            <TabsTrigger value="sports" className="text-white data-[state=active]:bg-rose-600">
              Sports
            </TabsTrigger>
            <TabsTrigger value="orders" className="text-white data-[state=active]:bg-rose-600">
              Orders
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

          <TabsContent value="events">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Registered Events</CardTitle>
                <CardDescription className="text-slate-400">Events you have registered for</CardDescription>
              </CardHeader>
              <CardContent>
                {!userData.registeredEvents || userData.registeredEvents.length === 0 ? (
                  <p className="text-center py-8 text-slate-500">No events registered yet.</p>
                ) : (
                  <div className="space-y-4">
                    {userData.registeredEvents.map((event, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border border-slate-700 rounded-lg bg-slate-800"
                      >
                        <div>
                          <h3 className="font-semibold text-white">{event.title}</h3>
                          <p className="text-sm text-slate-400">
                            {event.date} at {event.time}
                          </p>
                          <p className="text-sm text-slate-400">{event.venue}</p>
                        </div>
                        <Badge variant="secondary" className="bg-rose-600 text-white">
                          {event.prizePool}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sports">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Selected Sports</CardTitle>
                <CardDescription className="text-slate-400">Sports you're interested in participating</CardDescription>
              </CardHeader>
              <CardContent>
                {!userData.sportsToPlay || userData.sportsToPlay.length === 0 ? (
                  <p className="text-center py-8 text-slate-500">No sports selected yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {userData.sportsToPlay.map((sport, index) => (
                      <Badge key={index} variant="outline" className="text-sm border-slate-600 text-white">
                        {sport}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Merchandise Orders</CardTitle>
                <CardDescription className="text-slate-400">Your order history</CardDescription>
              </CardHeader>
              <CardContent>
                {!userData.orders || userData.orders.length === 0 ? (
                  <p className="text-center py-8 text-slate-500">No orders placed yet.</p>
                ) : (
                  <div className="space-y-4">
                    {userData.orders.map((order, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border border-slate-700 rounded-lg bg-slate-800"
                      >
                        <div>
                          <h3 className="font-semibold text-white">{order.title}</h3>
                          <p className="text-sm text-slate-400">Size: {order.size}</p>
                          <p className="text-sm text-slate-400">
                            Ordered: {new Date(order.orderDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-white">₹{order.price}</p>
                          <Badge
                            variant={order.status === "delivered" ? "default" : "secondary"}
                            className="bg-rose-600 text-white"
                          >
                            {order.status}
                          </Badge>
                        </div>
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
