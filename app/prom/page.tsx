"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Navbar } from "@/components/navbar";
import * as z from "zod";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Constants for easy configuration
const PROM_CONFIG = {
  EARLY_BIRD_LIMIT: 30,
  EARLY_BIRD_PRICE: 299,
  REGULAR_PRICE: 399,
  MAX_REGISTRATIONS: 100, // Add a maximum limit if needed
} as const;

// Types for registration state
type RegistrationStatus = {
  currentCount: number;
  isEarlyBirdAvailable: boolean;
  currentPrice: number;
  spotsRemaining: number;
};

const formSchema = z.object({
  partner1Name: z.string().min(2, {
    message: "Partner 1 name must be at least 2 characters.",
  }),
  partner2Name: z.string().min(2, {
    message: "Partner 2 name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export default function PromRegistration() {
  const { toast } = useToast();
  // This will be replaced with actual DB data when you add backend
  const [registrationStatus, setRegistrationStatus] = useState<RegistrationStatus>({
    currentCount: 0,
    isEarlyBirdAvailable: true,
    currentPrice: PROM_CONFIG.EARLY_BIRD_PRICE,
    spotsRemaining: PROM_CONFIG.MAX_REGISTRATIONS
  });

  // This useEffect will be replaced with your backend fetch
  useEffect(() => {
    // Simulate fetching registration count from backend
    const fetchRegistrationCount = async () => {
      try {
        // Replace this with actual API call
        // const response = await fetch('/api/prom/registrations/count');
        // const data = await response.json();
        // const count = data.count;
        
        const mockCount = 0; // This will come from your backend
        
        setRegistrationStatus({
          currentCount: mockCount,
          isEarlyBirdAvailable: mockCount < PROM_CONFIG.EARLY_BIRD_LIMIT,
          currentPrice: mockCount < PROM_CONFIG.EARLY_BIRD_LIMIT 
            ? PROM_CONFIG.EARLY_BIRD_PRICE 
            : PROM_CONFIG.REGULAR_PRICE,
          spotsRemaining: PROM_CONFIG.MAX_REGISTRATIONS - mockCount
        });
      } catch (error) {
        console.error('Error fetching registration count:', error);
      }
    };

    fetchRegistrationCount();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      partner1Name: "",
      partner2Name: "",
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // This will be replaced with your actual API call
      // const response = await fetch('/api/prom/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     ...values,
      //     price: registrationStatus.currentPrice
      //   })
      // });
      
      // Simulate API call
      if (registrationStatus.spotsRemaining === 0) {
        toast({
          title: "Registration Failed",
          description: "Sorry, all spots have been filled!",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Registration Submitted!",
        description: `You've secured the ${registrationStatus.isEarlyBirdAvailable ? 'early bird' : 'regular'} price of ₹${registrationStatus.currentPrice}!`,
      });
      
      // Update local state (this will be handled by your backend in reality)
      setRegistrationStatus(prev => ({
        ...prev,
        currentCount: prev.currentCount + 1,
        isEarlyBirdAvailable: (prev.currentCount + 1) < PROM_CONFIG.EARLY_BIRD_LIMIT,
        spotsRemaining: prev.spotsRemaining - 1,
        currentPrice: (prev.currentCount + 1) < PROM_CONFIG.EARLY_BIRD_LIMIT 
          ? PROM_CONFIG.EARLY_BIRD_PRICE 
          : PROM_CONFIG.REGULAR_PRICE
      }));

      console.log(values);
    } catch (error) {
      console.error('Error submitting registration:', error);
      toast({
        title: "Registration Failed",
        description: "There was an error submitting your registration. Please try again.",
        variant: "destructive"
      });
    }
  }

  return (
    <div className="min-h-screen w-full relative">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-800/40 via-background to-purple-900/30"></div>
      <div className="fixed inset-0 bg-[url('/sparkles.png')] opacity-20 animate-pulse pointer-events-none"></div>
      <Navbar />
      <div className="container mx-auto px-4 relative pt-24 pb-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Event Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Rann-Neeti Prom Night</h1>
            <p className="text-xl text-muted-foreground">A Night of Elegance and Celebration</p>
          </div>

          {/* Event Details and Registration Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="backdrop-blur-sm bg-background/90 border-purple-500/20 shadow-purple-500/10 shadow-lg">
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Date & Time</h3>
                  <p className="text-muted-foreground">October 15, 2025 | 7:00 PM onwards</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Venue</h3>
                  <p className="text-muted-foreground">IIT Mandi Main Auditorium</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Dress Code</h3>
                  <p className="text-muted-foreground">Formal Attire (Western or Traditional)</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Highlights</h3>
                  <ul className="list-disc list-inside text-muted-foreground">
                    <li>Professional DJ & Dance Floor</li>
                    <li>Photo Booth with Props</li>
                    <li>Gourmet Dinner Buffet</li>
                    <li>Best Couple Awards</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Registration Fee</h3>
                  <div className="space-y-1 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span className={registrationStatus.isEarlyBirdAvailable ? "text-emerald-500 dark:text-emerald-400" : "text-muted-foreground"}>
                        ₹{PROM_CONFIG.EARLY_BIRD_PRICE}
                      </span>
                      <span>
                        - Early Bird Price {registrationStatus.isEarlyBirdAvailable 
                          ? `(${PROM_CONFIG.EARLY_BIRD_LIMIT - registrationStatus.currentCount} spots left!)` 
                          : "(Ended)"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>₹{PROM_CONFIG.REGULAR_PRICE}</span>
                      <span>- Regular Price</span>
                    </div>
                    {/* <div className="mt-2 text-sm">
                      Total Registrations: {registrationStatus.currentCount} / {PROM_CONFIG.MAX_REGISTRATIONS}
                    </div> */}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Registration Form */}
            <Card className="backdrop-blur-sm bg-background/90 border-purple-500/20 shadow-purple-500/10 shadow-lg">
              <CardHeader>
                <CardTitle>Registration</CardTitle>
                <CardDescription>
                  Register now to secure your spot
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="partner1Name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Partner 1 Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="partner2Name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Partner 2 Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter email" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="text-center py-4 space-y-2">
                      {registrationStatus.isEarlyBirdAvailable ? (
                        <div className="space-y-1">
                          <p className="text-2xl font-semibold">₹{PROM_CONFIG.EARLY_BIRD_PRICE}</p>
                          <p className="text-sm text-emerald-500 dark:text-emerald-400 font-medium">
                            Early Bird Price ({PROM_CONFIG.EARLY_BIRD_LIMIT - registrationStatus.currentCount} spots left!)
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className="text-2xl font-semibold">₹{PROM_CONFIG.REGULAR_PRICE}</p>
                          <p className="text-sm text-muted-foreground">Regular Price</p>
                        </div>
                      )}
                      
                      {/* <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          {registrationStatus.spotsRemaining} spots remaining
                        </p>
                      </div> */}
                      
                      {registrationStatus.isEarlyBirdAvailable && (
                        <div className="pt-2">
                          <p className="text-sm bg-secondary/50 py-2 px-3 rounded-md inline-block">
                            ⚡ Early bird registrations are now open!
                          </p>
                        </div>
                      )}
                    </div>

                    <Button type="submit" className="w-full">
                      Register Now
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}