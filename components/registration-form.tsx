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

// Define the validation schema using Zod
const formSchema = z.object({
  leaderName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  collegeName: z.string({ required_error: "Please select a college." }).min(1, "Please select a college."),
  phoneNumber: z.string().min(10, { message: "Please enter a valid 10-digit phone number." }).max(13),
  email: z.string().email(),
  
  // Group sports participants into a nested object
  sports: z.object({
    cricket: z.coerce.number().int().min(0).max(16, "Max 16 players"),
    football: z.coerce.number().int().min(0).max(16, "Max 16 players"),
    hockey: z.coerce.number().int().min(0).max(16, "Max 16 players"),
    volleyballMen: z.coerce.number().int().min(0).max(12, "Max 12 players"),
    volleyballWomen: z.coerce.number().int().min(0).max(12, "Max 12 players"),
    basketballMen: z.coerce.number().int().min(0).max(12, "Max 12 players"),
    basketballWomen: z.coerce.number().int().min(0).max(12, "Max 12 players"),
    badmintonMen: z.coerce.number().int().min(0).max(5, "Max 5 players"),
    badmintonWomen: z.coerce.number().int().min(0).max(4, "Max 4 players"),
    tableTennisMen: z.coerce.number().int().min(0).max(125, "Max 125 players (pooled system)"),
    tableTennisWomen: z.coerce.number().int().min(0).max(125, "Max 125 players (pooled system)"),
    lawnTennisMen: z.coerce.number().int().min(0).max(6, "Max 6 players"),
    lawnTennisWomen: z.coerce.number().int().min(0).max(6, "Max 6 players"),
    squashMen: z.coerce.number().int().min(0).max(32, "Max 32 players"),
    squashWomen: z.coerce.number().int().min(0).max(32, "Max 32 players"),
    athleticsMen: z.coerce.number().int().min(0, "Cannot be negative"),
    athleticsWomen: z.coerce.number().int().min(0, "Cannot be negative"),
    chess: z.coerce.number().int().min(0).max(5, "Max 5 players"),
    esportsMen: z.coerce.number().int().min(0).max(10, "Max 10 players"),
    esportsWomen: z.coerce.number().int().min(0).max(10, "Max 10 players"),
  })
})

// Define a type for our sports data structure for type safety
type SportField = {
  name: keyof z.infer<typeof formSchema>['sports'];
  label: string;
  max?: number; // Use optional for sports with no max limit
};

// Array of sports objects to dynamically generate form fields
const sportsList: SportField[] = [
    { name: 'cricket', label: 'Cricket', max: 16 },
    { name: 'football', label: 'Football', max: 16 },
    { name: 'hockey', label: 'Hockey', max: 16 },
    { name: 'volleyballMen', label: 'Volleyball - Men', max: 12 },
    { name: 'volleyballWomen', label: 'Volleyball - Women', max: 12 },
    { name: 'basketballMen', label: 'Basketball - Men', max: 12 },
    { name: 'basketballWomen', label: 'Basketball - Women', max: 12 },
    { name: 'badmintonMen', label: 'Badminton - Men', max: 5 },
    { name: 'badmintonWomen', label: 'Badminton - Women', max: 4 },
    { name: 'lawnTennisMen', label: 'Lawn Tennis - Men', max: 6 },
    { name: 'lawnTennisWomen', label: 'Lawn Tennis - Women', max: 6 },
    { name: 'squashMen', label: 'Squash - Men', max:5 },
    { name: 'squashWomen', label: 'Squash - Women', max:5 },
    { name: 'tableTennisMen', label: 'Table Tennis - Men', max: 5 },
    { name: 'tableTennisWomen', label: 'Table Tennis - Women', max: 5 },
    { name: 'chess', label: 'Chess', max: 5 },
    { name: 'esportsMen', label: 'Esports - Men', max: 10 },
    { name: 'esportsWomen', label: 'Esports - Women', max: 10 },
    { name: 'athleticsMen', label: 'Athletics - Men (No Limit)' },
    { name: 'athleticsWomen', label: 'Athletics - Women (No Limit)' },
];


interface RegistrationFormProps {
  user: User
}

export function RegistrationForm({ user }: RegistrationFormProps) {
  const [colleges, setColleges] = useState<College[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // Corrected and completed defaultValues to match the Zod schema
    defaultValues: {
      leaderName: user?.name ?? "",
      email: user?.email ?? "",
      collegeName: "",
      phoneNumber: "",
      sports: {
        cricket: 0,
        football: 0,
        hockey: 0,
        volleyballMen: 0,
        volleyballWomen: 0,
        basketballMen: 0,
        basketballWomen: 0,
        badmintonMen: 0,
        badmintonWomen: 0,
        tableTennisMen: 0,
        tableTennisWomen: 0,
        lawnTennisMen: 0,
        lawnTennisWomen: 0,
        squashMen: 0,
        squashWomen: 0,
        athleticsMen: 0,
        athleticsWomen: 0,
        chess: 0,
        esportsMen: 0,
        esportsWomen: 0,
      }
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setError("")
    
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['.', 'e', 'E', '+', '-'].includes(e.key)) {
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
                                    <School className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <SelectValue placeholder="Select your college" />
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
             {/* Dynamically generate form fields by mapping over the sportsList array */}
             <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                {sportsList.map((sport) => (
                    <FormField
                        key={sport.name}
                        control={form.control}
                        name={`sports.${sport.name}`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                  {sport.label}
                                  {sport.max && ` (Max ${sport.max})`}
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min="0"
                                        max={sport.max}
                                        step="1"
                                        onKeyDown={handleKeyDown}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ))}
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