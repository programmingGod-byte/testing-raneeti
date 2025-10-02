import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { AboutFestival } from "@/components/about-festival"
import { CollegeFacilities } from "@/components/college-facilities"



import { ParticlesBackground } from "@/components/Particles" // Import the new component
import {HeadsGallery,Footer} from "@/components/heads-gallery" // Import the heads gallery component
export default function HomePage() {
  return (
    // Add `relative` to contain the absolutely positioned particles
    <main className="min-h-screen relative bg-transparent">
      <ParticlesBackground />
      <Navbar />
      <HeroSection />
      <AboutFestival />
      <CollegeFacilities />
      
      <HeadsGallery/>
      <Footer/>
    </main>
  )
}