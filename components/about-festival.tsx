import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Trophy, Users, Calendar, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"; // Import the Image component for optimized images

export function AboutFestival() {
  return (
    // Subtle gradient background for a less flat look
    <section className="py-20 sm:py-24 lg:py-32 bg-gradient-to-b from-background via-muted/40 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
            About <span className="text-primary" style={{ fontFamily: 'GreekFont' }}>RANN-NEETI</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            RANN-NEETI is IIT Mandi's premier sports festival that brings together the finest athletes from across the
            nation. Inspired by the Gods of Olympus, we celebrate the spirit of competition, excellence, and
            sportsmanship.
          </p>
        </div>

        {/* Logo and Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 items-center">
  {/* This container is now always centered */}
  <div className="justify-center flex">
    {/* The animate-float class is added here */}
    <div className="relative w-48 h-48 animate-float">
      <Image
        src="/images-removebg-preview.png" // Replace with your actual logo path
        alt="RANN-NEETI Logo"
        layout="fill"
        objectFit="contain"
        className="rounded-md shadow-md"
      />
    </div>
  </div>
  <div>
    <h3 className="text-2xl font-semibold text-foreground mb-4 tracking-tight">Embracing the Spirit</h3>
    <p className="text-lg text-muted-foreground leading-relaxed">
      The RANN-NEETI logo symbolizes the fusion of strategy ('Neeti') with the battlefield ('Rann'), embodying the
      essence of competitive sports. It represents the platform where tactical prowess meets athletic excellence,
      in the majestic setting of IIT Mandi.
    </p>
    {/* You can add more details or a call to action here if needed */}
  </div>
</div>
        {/* Enhanced cards with better hover effects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          <InfoCard
            icon={<Trophy className="w-8 h-8 text-primary" />}
            title="50+ Events"
            description="From traditional sports to modern competitions"
          />
          <InfoCard
            icon={<Users className="w-8 h-8 text-primary" />}
            title="1000+ Athletes"
            description="Participants from top colleges nationwide"
          />
          <InfoCard
            icon={<Calendar className="w-8 h-8 text-primary" />}
            title="3 Days of Glory"
            description="Non-stop action and entertainment"
          />
          <InfoCard
            icon={<MapPin className="w-8 h-8 text-primary" />}
            title="IIT Mandi"
            description="World-class facilities in the Himalayas"
          />
        </div>

        {/* Revamped layout with text on the left and image on the right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            {/* Added a small accent line */}
            <div className="w-24 h-1 bg-primary rounded-full mb-6"></div>
            <h3 className="text-3xl md:text-4xl font-bold mb-6 text-foreground tracking-tight">The Legend Begins</h3>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Just as the ancient Olympic Games brought together the greatest athletes of Greece, RANN-NEETI unites
              the most talented sportspeople from across India. Our festival embodies the Olympic spirit of
              excellence, friendship, and respect.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Experience the thrill of competition in the breathtaking landscape of Himachal Pradesh, where every
              victory is celebrated like the triumphs of the gods themselves.
            </p>
            <Button asChild size="lg">
              <Link href="/gallery" className="flex items-center gap-2">
                Explore the Legacy
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-amber-400 to-orange-600 rounded-lg blur-lg opacity-50 group-hover:opacity-75 transition duration-500"></div>
            <img
              src="https://img.freepik.com/free-photo/sports-tools_53876-138077.jpg?semt=ais_hybrid&w=740&q=80"
              alt="RANN-NEETI Festival"
              className="relative rounded-lg shadow-2xl w-full h-auto transform group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// Reusable Card component for cleaner code
function InfoCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="text-center bg-card/60 backdrop-blur-sm border-border/20 hover:border-primary/50 hover:bg-card hover:-translate-y-2 transition-all duration-300 shadow-md hover:shadow-primary/10">
      <CardContent className="p-8">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5 border-2 border-primary/20">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2 text-foreground">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}