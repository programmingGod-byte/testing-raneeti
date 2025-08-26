"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import type { User } from "next-auth"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User as UserIcon, School, Phone, Mail, Loader2 } from "lucide-react"

// Define a simple type for the college data we expect from the API
interface College {
  _id: string;
  name: string;
}

// Define the validation schema using Zod to match the new User interface structure
const formSchema = z.object({
  leaderName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  collegeName: z.string({ required_error: "Please select a college." }).min(1, "Please select a college."),
  phoneNumber: z.string().min(10, { message: "Please enter a valid 10-digit phone number." }).max(13),
  email: z.string().email(),
  
  // Group sports participants into a nested object to match the backend schema
  sports: z.object({
    cricket: z.coerce.number().int("Please enter a whole number.").min(0).max(16, "Max 16 players"),
    badmintonMen: z.coerce.number().int("Please enter a whole number.").min(0).max(5, "Max 5 players"),
    badmintonWomen: z.coerce.number().int("Please enter a whole number.").min(0).max(4, "Max 4 players"),
    volleyballMen: z.coerce.number().int("Please enter a whole number.").min(0).max(12, "Max 12 players"),
    volleyballWomen: z.coerce.number().int("Please enter a whole number.").min(0).max(12, "Max 12 players"),
    football: z.coerce.number().int("Please enter a whole number.").min(0).max(16, "Max 16 players"),
    hockey: z.coerce.number().int("Please enter a whole number.").min(0).max(15, "Max 15 players"),
    basketballMen: z.coerce.number().int("Please enter a whole number.").min(0).max(11, "Max 11 players"),
    basketballWomen: z.coerce.number().int("Please enter a whole number.").min(0).max(10, "Max 10 players"),
    tableTennisMen: z.coerce.number().int("Please enter a whole number.").min(0).max(4, "Max 4 players"),
    tableTennisWomen: z.coerce.number().int("Please enter a whole number.").min(0).max(3, "Max 3 players"),
    chess: z.coerce.number().int("Please enter a whole number.").min(0).max(5, "Max 4 players + 1 standby"),
    lawnTennisMen: z.coerce.number().int("Please enter a whole number.").min(0).max(4, "Max 4 players"),
    lawnTennisWomen: z.coerce.number().int("Please enter a whole number.").min(0).max(4, "Max 4 players"),
    athletics: z.coerce.number().int("Please enter a whole number.").min(0, "Cannot be negative"),
  })
})

interface RegistrationFormProps {
  user: User
}

export function RegistrationForm({ user }: RegistrationFormProps) {
  const [colleges, setColleges] = useState<College[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  // Fetch colleges from the API when the component mounts
  useEffect(() => {
    async function fetchColleges() {
      try {
        const response = await fetch("/api/colleges")
        if (response.ok) {
          const data = await response.json()
          setColleges(data)
        } else {
          console.error("Failed to fetch colleges list.")
        }
      } catch (err) {
        console.error("An error occurred while fetching colleges:", err)
        setError("Could not load the list of colleges. Please try again later.")
      }
    }
    fetchColleges()
  }, [])

  // Initialize react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      leaderName: user?.name ?? "",
      email: user?.email ?? "",
      collegeName: "",
      phoneNumber: "",
      sports: {
        cricket: 0,
        badmintonMen: 0,
        badmintonWomen: 0,
        volleyballMen: 0,
        volleyballWomen: 0,
        football: 0,
        hockey: 0,
        basketballMen: 0,
        basketballWomen: 0,
        tableTennisMen: 0,
        tableTennisWomen: 0,
        chess: 0,
        lawnTennisMen: 0,
        lawnTennisWomen: 0,
        athletics: 0,
      }
    },
  })

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setError("")
    
    // The `values` object now matches the nested structure required by the backend
    try {
      const response = await fetch("/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/dashboard")
      } else {
        setError(data.error || "Registration failed. Please try again.")
      }
    } catch (err) {
      console.error("Registration submission error:", err)
      setError("An unexpected error occurred. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Prevent decimal and other non-integer characters in number inputs
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '.' || e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
      e.preventDefault();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Section 1: Contingent Leader and College Details */}
        <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Contingent Details</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField control={form.control} name="leaderName" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Contingent Leader's Name</FormLabel>
                        <FormControl>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input placeholder="e.g. Rohan Sharma" {...field} className="pl-9" />
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="collegeName" render={({ field }) => (
                    <FormItem>
                        <FormLabel>College Name</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <div className="flex items-center">
                                        <School className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <SelectValue placeholder="Select your college" className="pl-9" />
                                    </div>
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {colleges.length > 0 ? (
                                    colleges.map((college) => (
                                        <SelectItem key={college._id} value={college.name}>
                                            {college.name}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="loading" disabled>Loading colleges...</SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                             <div className="relative">
                                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input type="tel" placeholder="98765 43210" {...field} className="pl-9" />
                            </div>
                        </FormControl>
                         <FormDescription>Preferably a WhatsApp number.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                             <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input placeholder="Your email" {...field} readOnly className="pl-9 bg-muted/50 cursor-not-allowed" />
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>
        </div>
        
        <Separator />
        
        {/* Section 2: Sports Participation Details */}
        <div className="space-y-4">
             <h3 className="text-lg font-medium text-foreground">Sports Participation</h3>
             <p className="text-sm text-muted-foreground">
                Enter the number of participants for each sport. If not participating, enter "0".
             </p>
             <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                {/* Updated field names to use dot notation for the nested 'sports' object */}
                <FormField control={form.control} name="sports.cricket" render={({ field }) => (<FormItem><FormLabel>Cricket (Max 16)</FormLabel><FormControl><Input type="number" min="0" max="16" step="1" onKeyDown={handleKeyDown} {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="sports.football" render={({ field }) => (<FormItem><FormLabel>Football (Max 16)</FormLabel><FormControl><Input type="number" min="0" max="16" step="1" onKeyDown={handleKeyDown} {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="sports.hockey" render={({ field }) => (<FormItem><FormLabel>Hockey (Max 15)</FormLabel><FormControl><Input type="number" min="0" max="15" step="1" onKeyDown={handleKeyDown} {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="sports.chess" render={({ field }) => (<FormItem><FormLabel>Chess (Max 4+1)</FormLabel><FormControl><Input type="number" min="0" max="5" step="1" onKeyDown={handleKeyDown} {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="sports.badmintonMen" render={({ field }) => (<FormItem><FormLabel>Badminton - Men (Max 5)</FormLabel><FormControl><Input type="number" min="0" max="5" step="1" onKeyDown={handleKeyDown} {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="sports.badmintonWomen" render={({ field }) => (<FormItem><FormLabel>Badminton - Women (Max 4)</FormLabel><FormControl><Input type="number" min="0" max="4" step="1" onKeyDown={handleKeyDown} {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="sports.volleyballMen" render={({ field }) => (<FormItem><FormLabel>Volleyball - Men (Max 12)</FormLabel><FormControl><Input type="number" min="0" max="12" step="1" onKeyDown={handleKeyDown} {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="sports.volleyballWomen" render={({ field }) => (<FormItem><FormLabel>Volleyball - Women (Max 12)</FormLabel><FormControl><Input type="number" min="0" max="12" step="1" onKeyDown={handleKeyDown} {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="sports.basketballMen" render={({ field }) => (<FormItem><FormLabel>Basketball - Men (Max 11)</FormLabel><FormControl><Input type="number" min="0" max="11" step="1" onKeyDown={handleKeyDown} {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="sports.basketballWomen" render={({ field }) => (<FormItem><FormLabel>Basketball - Women (Max 10)</FormLabel><FormControl><Input type="number" min="0" max="10" step="1" onKeyDown={handleKeyDown} {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="sports.tableTennisMen" render={({ field }) => (<FormItem><FormLabel>Table Tennis - Men (Max 4)</FormLabel><FormControl><Input type="number" min="0" max="4" step="1" onKeyDown={handleKeyDown} {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="sports.tableTennisWomen" render={({ field }) => (<FormItem><FormLabel>Table Tennis - Women (Max 3)</FormLabel><FormControl><Input type="number" min="0" max="3" step="1" onKeyDown={handleKeyDown} {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="sports.lawnTennisMen" render={({ field }) => (<FormItem><FormLabel>Lawn Tennis - Men (Max 4)</FormLabel><FormControl><Input type="number" min="0" max="4" step="1" onKeyDown={handleKeyDown} {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="sports.lawnTennisWomen" render={({ field }) => (<FormItem><FormLabel>Lawn Tennis - Women (Max 4)</FormLabel><FormControl><Input type="number" min="0" max="4" step="1" onKeyDown={handleKeyDown} {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="sports.athletics" render={({ field }) => (<FormItem className="sm:col-span-2"><FormLabel>Athletics (No Max Limit)</FormLabel><FormControl><Input type="number" min="0" step="1" onKeyDown={handleKeyDown} {...field} /></FormControl><FormMessage /></FormItem>)} />
             </div>
        </div>

        {error && (
            <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                    </>
                ) : "Complete Registration"}
            </Button>
        </div>
      </form>
    </Form>
  )
}
