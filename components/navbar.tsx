"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"


export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session, status } = useSession()
  const [usePrimaryFont, setUsePrimaryFont] = useState(true)

  useEffect(() => {
    // This interval triggers the animation for the whole word
    const intervalId = setInterval(() => {
      setUsePrimaryFont((prev) => !prev)
    }, 3000) // Increased interval to 3s to better see the effect

    return () => clearInterval(intervalId)
  }, [])

  const logoText = "RANN-NEETI";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            {/* === CHANGED SECTION FOR WORD-BY-WORD ANIMATION === */}
            <div className="flex text-2xl font-bold text-primary" aria-label={logoText}>
              {logoText.split('').map((char, index) => (
                <div key={index} className="relative">
                  {/* 1. Invisible spacer character to maintain correct width and layout */}
                  <span className="opacity-0" style={{ fontFamily: 'Audiowide, sans-serif' }}>
                    {char === ' ' ? '\u00A0' : char}
                  </span>

                  {/* 2. Absolutely positioned character with the first font */}
                  <span
                    className="absolute left-0 top-0 transition-opacity duration-500"
                    style={{
                      fontFamily: 'Audiowide, sans-serif',
                      opacity: usePrimaryFont ? 1 : 0,
                      transitionDelay: `${index * 75}ms` // Staggered delay
                    }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>

                  {/* 3. Absolutely positioned character with the second font */}
                  <span
                    className="absolute left-0 top-0 transition-opacity duration-500"
                    style={{
                      fontFamily: 'GreekFont, sans-serif',
                      opacity: !usePrimaryFont ? 1 : 0,
                      transitionDelay: `${index * 75}ms` // Staggered delay
                    }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                </div>
              ))}
            </div>
            {/* === END OF CHANGED SECTION === */}

            {/* <div className="text-sm text-muted-foreground hidden sm:block">IIT Mandi</div> */}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium" style={{ fontFamily: 'GreekFont' }}>
              Home
            </Link>

              <Link
                href="/#our-teams"
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors font-medium" style={{ fontFamily: 'GreekFont' }}
                onClick={() => setIsMenuOpen(false)}
              >
                Our Teams
              </Link>
            <Link href="/events" className="text-foreground hover:text-primary transition-colors font-medium" style={{ fontFamily: 'GreekFont' }}>
              Events
            </Link> 
             <Link href="/gallery" className="text-foreground hover:text-primary transition-colors font-medium" style={{ fontFamily: 'GreekFont' }}>
              Gallery
            </Link>
            {
              status === "authenticated" ? (
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <Link href="/register">Register Now</Link>
                </Button>
              ) 
            }
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t border-border">
              <Link
                href="/"
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>

              <Link
                href="/#our-teams"
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Our Teams
              </Link>
              <Link
                href="/events"
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Events
              </Link>
              <Link
                href="/gallery"
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Gallery
              </Link>
              <div className="px-3 py-2">
                <Button asChild className="w-full bg-primary hover:bg-primary/90">
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    Register Now
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}