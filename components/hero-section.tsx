"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Trophy, Calendar } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

export function HeroSection() {
  const heroContentRef = useRef(null);
  const eventDate = new Date("2025-10-10T00:00:00");
  
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(eventDate));
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDeviceSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkDeviceSize();
    window.addEventListener("resize", checkDeviceSize);
    return () => window.removeEventListener("resize", checkDeviceSize);
  }, []);

  useEffect(() => {
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
      .from(".animate-countdown", {
        autoAlpha: 0,
        scale: 0.9,
        ease: "power3.out",
      }, "-=0.5");
    }, heroContentRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(eventDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [eventDate]);

  interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }

  function calculateTimeLeft(targetDate: Date): TimeLeft {
    const difference = +targetDate - +new Date();
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video & Overlay */}
      <div className="absolute inset-0 z-0">
        {
          // --- PROBLEM SOLVED ---
          // This logic is now correct.
          // If isMobile is true, show the lightweight <img>.
          // If isMobile is false (desktop), show the <video>.
          isMobile ? (
            <img src="/final_mobile.png" alt="Hero Background" className="w-full h-full object-cover" />
          ) : (
            <video 
              autoPlay 
              muted 
              playsInline 
              loop
              // It's good practice to have a poster for the desktop video too
              poster="/final_desktop.png" 
              className="w-full h-full object-cover"
            >
              <source src="/Final.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )
        }
        <div className="absolute inset-0 bg-black/60" />
      </div>
      
      <div 
        ref={heroContentRef} 
        className="relative z-10 flex flex-col items-center justify-center text-center text-white w-full max-w-5xl mx-auto px-4 pt-16 sm:pt-0"
      >
        <div className="flex flex-col items-center">
          <div className="mask-container">
            <h1 className="animate-masked-text font-bold leading-tight mb-2 md:mb-4">
              <span
                className="bg-gradient-to-r from-red-900 via-red-800 to-red-700 bg-clip-text text-transparent text-6xl sm:text-7xl md:text-8xl lg:text-[9rem]"
                style={{ fontFamily: 'GreekFont' }}
              >
                RANN-NEETI
              </span>
              <br />
              <span className="text-2xl sm:text-3xl md:text-4xl text-white drop-shadow-2xl">
                Gods of Olympus
              </span>
            </h1>
          </div>

          <div className="mask-container">
            <p className="animate-masked-text text-base sm:text-lg md:text-xl mb-6 md:mb-8 text-gray-200 max-w-2xl mx-auto leading-relaxed">
              Embrace the Spirit of the Gods. Join IIT Mandi's ultimate sports festival where legends are born and champions rise.
            </p>
          </div>

          <div className="animate-buttons flex flex-col sm:flex-row gap-4 justify-center items-center mb-6 md:mb-8">
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

        {/* --- Countdown Timer --- */}
        <div className="animate-countdown w-full max-w-lg mt-4 md:mt-6">
          <div className="bg-black/20 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-white/10 shadow-lg">
            <div className="flex items-center justify-center gap-2 sm:gap-4">
              {Object.entries(timeLeft).map(([label, value]) => (
                <div key={label} className="flex-1 flex flex-col items-center">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tabular-nums">
                    {String(value).padStart(2, '0')}
                  </div>
                  <div className="text-xs uppercase tracking-widest text-gray-300 capitalize mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}