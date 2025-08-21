"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { College } from "@/lib/models/College"
import type { User } from "next-auth"

interface RegistrationFormProps {
  user: User
}

const sportsOptions = [
  "Football",
  "Basketball",
  "Cricket",
  "Badminton",
  "Table Tennis",
  "Tennis",
  "Volleyball",
  "Swimming",
  "Athletics (Track & Field)",
  "Hockey",
  "Kabaddi",
  "Chess",
  "Carrom",
  "Weightlifting",
  "Boxing",
  "Wrestling",
  "Cycling",
  "Rock Climbing",
  "Archery",
  "Shooting",
]

export function RegistrationForm({ user }: RegistrationFormProps) {
  const [colleges, setColleges] = useState<College[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: user.name || "",
    phoneNumber: "",
    collegeName: "",
    collegeType: "",
    sportsToPlay: [] as string[],
  })
  const router = useRouter()

  useEffect(() => {
    fetchColleges()
  }, [])

  const fetchColleges = async () => {
    try {
      const response = await fetch("/api/colleges")
      if (response.ok) {
        const data = await response.json()
        setColleges(data)
      }
    } catch (error) {
      console.error("Error fetching colleges:", error)
    }
  }

  const handleSportsChange = (sport: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        sportsToPlay: [...formData.sportsToPlay, sport],
      })
    } else {
      setFormData({
        ...formData,
        sportsToPlay: formData.sportsToPlay.filter((s) => s !== sport),
      })
    }
  }

  const handleCollegeChange = (collegeId: string) => {
    const selectedCollege = colleges.find((c) => c._id?.toString() === collegeId)
    if (selectedCollege) {
      setFormData({
        ...formData,
        collegeName: selectedCollege.name,
        collegeType: selectedCollege.type,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (formData.sportsToPlay.length === 0) {
      setError("Please select at least one sport to participate in.")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/dashboard")
      } else {
        setError(data.error || "Registration failed. Please try again.")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            placeholder="+91 XXXXXXXXXX"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="college">Select Your College</Label>
        <Select onValueChange={handleCollegeChange} required>
          <SelectTrigger>
            <SelectValue placeholder="Choose your college" />
          </SelectTrigger>
          <SelectContent>
            {colleges.map((college) => (
              <SelectItem key={college._id?.toString()} value={college._id?.toString() || ""}>
                {college.name} ({college.type})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label>Sports to Participate In</Label>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Available Sports</CardTitle>
            <CardDescription>Select all sports you want to participate in (multiple selection allowed)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {sportsOptions.map((sport) => (
                <div key={sport} className="flex items-center space-x-2">
                  <Checkbox
                    id={sport}
                    checked={formData.sportsToPlay.includes(sport)}
                    onCheckedChange={(checked) => handleSportsChange(sport, checked as boolean)}
                  />
                  <Label htmlFor={sport} className="text-sm font-normal cursor-pointer">
                    {sport}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.push("/")}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Registering..." : "Complete Registration"}
        </Button>
      </div>
    </form>
  )
}
