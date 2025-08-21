"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, MapPin, Trophy, Users, CheckCircle, Zap, Target, Search } from "lucide-react"
import type { Event } from "@/lib/models/Event"
import type { Session } from "next-auth"

interface EventsGridProps {
  session: Session | null
}

export function EventsGrid({ session }: EventsGridProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [userRegistrations, setUserRegistrations] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [registering, setRegistering] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState("all")
  const router = useRouter()

  useEffect(() => {
    fetchEvents()
    if (session) {
      fetchUserRegistrations()
    }
  }, [session])

  useEffect(() => {
    let filtered = events.filter(
      (event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (filterBy === "registered") {
      filtered = filtered.filter((event) => userRegistrations.includes(event._id?.toString() || ""))
    } else if (filterBy === "available") {
      filtered = filtered.filter((event) => !userRegistrations.includes(event._id?.toString() || ""))
    }

    setFilteredEvents(filtered)
  }, [events, searchTerm, filterBy, userRegistrations])

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events")
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      }
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUserRegistrations = async () => {
    try {
      const response = await fetch("/api/user/registrations")
      if (response.ok) {
        const data = await response.json()
        setUserRegistrations(data.eventIds || [])
      }
    } catch (error) {
      console.error("Error fetching user registrations:", error)
    }
  }

  const handleRegistration = async (eventId: string, isRegistered: boolean) => {
    if (!session) {
      router.push("/auth/signin")
      return
    }

    setRegistering(eventId)
    setMessage(null)

    try {
      const response = await fetch("/api/events/register", {
        method: isRegistered ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      })

      const data = await response.json()

      if (response.ok) {
        if (isRegistered) {
          setUserRegistrations((prev) => prev.filter((id) => id !== eventId))
          setMessage({ type: "success", text: "Successfully unregistered from event!" })
        } else {
          setUserRegistrations((prev) => [...prev, eventId])
          setMessage({ type: "success", text: "Successfully registered for event!" })
        }
        await fetchEvents() // Refresh to update registration counts
      } else {
        setMessage({ type: "error", text: data.error || "Registration failed" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred. Please try again." })
    } finally {
      setRegistering(null)
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
        <p className="mt-4 text-slate-400">Loading events...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {message && (
        <Alert
          className={
            message.type === "success" ? "border-green-500/50 bg-green-500/10" : "border-red-500/50 bg-red-500/10"
          }
        >
          <AlertDescription className={message.type === "success" ? "text-green-400" : "text-red-400"}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-900/50 border-slate-600 text-slate-200 placeholder-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-40 bg-slate-900/50 border-slate-600 text-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="registered">My Events</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-300 mb-2">
            {searchTerm || filterBy !== "all" ? "No events found" : "No Events Available"}
          </h3>
          <p className="text-slate-500">
            {searchTerm || filterBy !== "all"
              ? "Try adjusting your search or filters"
              : "Events will be announced soon. Stay tuned!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredEvents.map((event) => {
            const isRegistered = userRegistrations.includes(event._id?.toString() || "")
            const isProcessing = registering === event._id?.toString()

            return (
              <Card
                key={event._id?.toString()}
                className="group overflow-hidden bg-gradient-to-br from-slate-900/90 to-black/90 border-amber-500/30 hover:border-amber-500 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20 backdrop-blur-sm"
              >
                <div className="flex flex-col md:flex-row h-full">
                  {/* Left side - Image */}
                  <div className="relative md:w-1/2 h-64 md:h-auto overflow-hidden">
                    <img
                      src={event.image || "/placeholder.svg?height=400&width=600&query=sports competition arena"}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/20 to-black/60" />

                    {/* Registration Status */}
                    {isRegistered && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-green-500/90 hover:bg-green-600 backdrop-blur-sm animate-pulse border-green-400">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Registered
                        </Badge>
                      </div>
                    )}

                    {/* Prize Pool Highlight */}
                    <div className="absolute bottom-4 left-4">
                      <div className="bg-gradient-to-r from-amber-500/30 to-orange-500/30 backdrop-blur-sm rounded-lg px-4 py-2 border border-amber-500/50">
                        <span className="text-amber-300 font-bold text-lg flex items-center gap-2">
                          <Trophy className="w-5 h-5" />
                          {event.prizePool}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Content */}
                  <div className="md:w-1/2 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                          <Zap className="w-3 h-3 mr-1" />
                          Sports Competition
                        </Badge>
                        <Badge variant="outline" className="border-slate-600 text-slate-300">
                          <Users className="w-3 h-3 mr-1" />
                          {event.registrations?.length || 0} warriors
                        </Badge>
                      </div>

                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors flex items-center gap-2">
                        <Target className="w-6 h-6 text-amber-500" />
                        {event.title}
                      </h3>

                      <p className="text-slate-300 mb-4 leading-relaxed">{event.description}</p>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-slate-300">
                          <MapPin className="w-5 h-5 text-amber-500 flex-shrink-0" />
                          <span className="font-medium">{event.venue}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-300">
                          <Calendar className="w-5 h-5 text-amber-500 flex-shrink-0" />
                          <span className="font-medium">{event.date}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-300">
                          <Clock className="w-5 h-5 text-amber-500 flex-shrink-0" />
                          <span className="font-medium">{event.time}</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        if (isRegistered) {
                          router.push("/dashboard")
                        } else {
                          handleRegistration(event._id?.toString() || "", false)
                        }
                      }}
                      disabled={isProcessing || !session}
                      className={`w-full font-bold py-3 text-lg transition-all duration-300 ${
                        isRegistered
                          ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:shadow-lg hover:shadow-green-500/25"
                          : "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 hover:shadow-lg hover:shadow-amber-500/25"
                      }`}
                    >
                      {isProcessing
                        ? "Processing..."
                        : !session
                          ? "Login to Join Battle"
                          : isRegistered
                            ? "Go to Dashboard"
                            : "Enter Arena"}
                    </Button>

                    {/* Unregister option for registered users */}
                    {isRegistered && session && (
                      <Button
                        onClick={() => handleRegistration(event._id?.toString() || "", true)}
                        disabled={isProcessing}
                        variant="outline"
                        className="w-full mt-2 border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500"
                      >
                        Leave Arena
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
