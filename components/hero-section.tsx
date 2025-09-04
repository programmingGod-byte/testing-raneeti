"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Trophy, Calendar } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

export function HeroSection() {
  const heroContentRef = useRef(null);
  const eventDate = new Date("2025-10-05T00:00:00");
  
  const [isVideoFinished, setIsVideoFinished] = useState(false);
  
  // --- New Logic to Detect Mobile Screen Size Start ---
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // This function checks the window width and updates the state.
    // 768px is a common breakpoint for tablets (Tailwind's `md` breakpoint).
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Run the function on the initial client-side render
    handleResize();

    // Add an event listener to check again if the window is resized
    window.addEventListener("resize", handleResize);

    // Cleanup: remove the event listener when the component unmounts
    return () => window.removeEventListener("resize", handleResize);
  }, []); // The empty dependency array ensures this effect runs only once on mount.
  // --- New Logic to Detect Mobile Screen Size End ---


  const handleVideoEnd = () => {
    setIsVideoFinished(true);
  };

  // --- Countdown Logic Start ---
  interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }

  const calculateTimeLeft = (targetDate: Date): TimeLeft => {
    const difference = +targetDate - +new Date();
    let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };
  
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(eventDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(eventDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [eventDate]);
  // --- Countdown Logic End ---


  useEffect(() => {
    if (!isVideoFinished) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline();

        tl.from(".animate-masked-text", {
          yPercent: 100,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
        })
        .from(".animate-buttons > *", {
          autoAlpha: 0,
          y: 20,
          stagger: 0.1,
          ease: "power3.out",
        }, "-=0.5")
        .from(".animate-stat", {
          autoAlpha: 0,
          stagger: 0.1,
          ease: "power3.out",
        }, "-=0.5")
        .from(".animate-countdown", {
          autoAlpha: 0,
          scale: 0.9,
          ease: "power3.out",
        }, "-=0.5");

      }, heroContentRef);

      return () => ctx.revert();
    }
  }, [isVideoFinished]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video & Image */}
      <div className="absolute inset-0 z-0">
        {/* The background image is always present as a fallback */}
        <img
          src="/mobile.png"
          alt="Rann-Neeti background poster"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        {/* --- MODIFIED PART --- */}
        {/* The video and its dark overlay will only render if:
            1. The video hasn't finished.
            2. The screen is NOT mobile (`!isMobile`).
        */}
        {!isVideoFinished && !isMobile && (
          <>
            <video 
  autoPlay 
  muted 
  playsInline 
  loop
  className="absolute inset-0 w-full h-full object-cover"
>
  <source src="/Final.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

            {/* The overlay is also conditional to match the video */}
            <div className="absolute inset-0 bg-black/60" />
          </>
        )}
      </div>

      {/* This entire block will now disappear after the video finishes */}
      {!isVideoFinished && (
        <>
          {/* Hero Content */}
          <div ref={heroContentRef} className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
            <div className="mask-container">
              <h1 className="animate-masked-text text-6xl md:text-8xl font-bold mb-6 leading-tight">
                {
                  !isMobile && <>
                  <span
                  className="bg-gradient-to-r from-red-900 via-red-800 to-red-700 bg-clip-text text-transparent"
                  style={{ fontFamily: 'GreekFont', fontSize: '9rem' }}
                >
                  RANN-NEETI
                </span>
                <br />
                <span className="text-3xl md:text-5xl text-white drop-shadow-2xl" >Gods of Olympus</span>
                  </>
                }
              </h1>
            </div>

            <div className="mask-container">
              <p className="animate-masked-text text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto leading-relaxed">
               {
                !isMobile && "Embrace the Spirit of the Gods. Join IIT Mandi's ultimate sports festival where legends are born and champions rise."
               }
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
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
            <div className="animate-bounce">
              <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* --- Countdown Timer (this will always be visible) --- */}
      <div className="animate-countdown absolute bottom-24 left-1/2 transform -translate-x-1/2 z-10 w-[90%] max-w-lg">
         <div className="bg-black/20 backdrop-blur-sm p-6 rounded-xl border border-white/10 shadow-lg">
            <div className="flex items-center justify-center gap-4 md:gap-8">
                {Object.entries(timeLeft).map(([label, value]) => (
                    <div key={label} className="flex items-center gap-4 md:gap-8">
                        <div className="flex flex-col items-center">
                            <div className="text-4xl md:text-5xl font-bold text-white tabular-nums">
                                {String(value).padStart(2, '0')}
                            </div>
                            <div className="text-xs uppercase tracking-widest text-gray-300 capitalize">{label}</div>
                        </div>
                        {label !== 'seconds' && <span className="text-4xl font-light text-white/50 -mt-4">:</span>}
                    </div>
                ))}
            </div>
        </div>
      </div>
    </section>
  )
}