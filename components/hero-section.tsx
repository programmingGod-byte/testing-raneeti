"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Trophy, Calendar } from "lucide-react";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";

export function HeroSection() {
  const heroContentRef = useRef(null);

  // This useEffect hook runs once when the component mounts.
  useEffect(() => {
    // gsap.context() is the modern way to handle cleanup automatically.
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Animate the text elements sliding up from behind their masks.
      // The 'yPercent: 100' starts them 100% of their own height below their container.
      tl.from(".animate-masked-text", {
        yPercent: 100,
        duration: 1,
        stagger: 0.2, // Animates the title and paragraph one after another.
        ease: "power3.out",
      })
      // Animate the buttons fading in and sliding up.
      .from(".animate-buttons > *", {
        autoAlpha: 0, // Fades in and handles visibility.
        y: 20,
        stagger: 0.1,
        ease: "power3.out",
      }, "-=0.5") // Overlap with the previous animation for a smoother flow.
      // Animate the stats fading in.
      .from(".animate-stat", {
        autoAlpha: 0,
        stagger: 0.1,
        ease: "power3.out",
      }, "-=0.5");

    }, heroContentRef); // Scope the animations to the heroContentRef element.

    // Cleanup function to revert all animations when the component unmounts.
    return () => ctx.revert();
  }, []); // Empty dependency array ensures this runs only once.

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover" poster="/epic-sports-arena.png">
          <source src="/Final.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Hero Content */}
      <div ref={heroContentRef} className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        
        {/* The H1 is wrapped in a .mask-container */}
        <div className="mask-container">
          <h1 className="animate-masked-text text-6xl md:text-8xl font-bold mb-6 leading-tight">
            <span
              className="bg-gradient-to-r from-red-900 via-red-800 to-red-700 bg-clip-text text-transparent"
              style={{ fontFamily: 'GreekFont', fontSize: '9rem' }}
            >
              RANN-NEETI
            </span>
            <br />
            <span className="text-3xl md:text-5xl text-white drop-shadow-2xl">Gods of Olympus</span>
          </h1>
        </div>

        {/* The paragraph is also wrapped in a .mask-container */}
        <div className="mask-container">
          <p className="animate-masked-text text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Embrace the Spirit of the Gods. Join IIT Mandi's ultimate sports festival where legends are born and champions
            rise.
          </p>
        </div>

        <div className="animate-buttons flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-3">
            <Link href="/register" className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Register Now
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-primary bg-transparent"
          >
            <Link href="/events" className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              View Events
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="animate-stat text-center">
            <div className="text-3xl font-bold text-primary mb-2">50+</div>
            <div className="text-gray-300">Sports Events</div>
          </div>
          <div className="animate-stat text-center">
            <div className="text-3xl font-bold text-primary mb-2">1000+</div>
            <div className="text-gray-300">Participants</div>
          </div>
          <div className="animate-stat text-center">
            <div className="text-3xl font-bold text-primary mb-2">₹5L+</div>
            <div className="text-gray-300">Prize Pool</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  )
}