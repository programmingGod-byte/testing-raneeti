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
    const intervalId = setInterval(() => {
      setUsePrimaryFont((prev) => !prev)
    }, 3000)
    return () => clearInterval(intervalId)
  }, [])

  const logoText = "RANN-NEETI";

  return (
  <nav
  className="fixed top-0 left-0 right-0 z-50
  bg-black/30 backdrop-blur-md border-b border-white/20 shadow-lg transition-colors duration-300"
>



      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex text-2xl font-bold text-white drop-shadow-md" aria-label={logoText}>
              {
                <span style={
                  {
                    fontFamily: 'GreekFont, sans-serif',
                  }
                }>
                  {
                    logoText
                  }
                </span>
              }
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white hover:text-primary transition-colors font-medium" style={{ fontFamily: 'GreekFont' }}>
              Home
            </Link>
            <Link
              href="/#our-teams"
              className="block px-3 py-2 text-white hover:text-primary transition-colors font-medium"
              style={{ fontFamily: 'GreekFont' }}
              onClick={() => setIsMenuOpen(false)}
            >
              Our Teams
            </Link>
            <Link href="/events" className="text-white hover:text-primary transition-colors font-medium" style={{ fontFamily: 'GreekFont' }}>
              Events
            </Link>
            <Link href="/merch" className="text-white hover:text-primary transition-colors font-medium" style={{ fontFamily: 'GreekFont' }}>
              Merch
            </Link>
            <Link href="/gallery" className="text-white hover:text-primary transition-colors font-medium" style={{ fontFamily: 'GreekFont' }}>
              Gallery
            </Link>
            {status === "authenticated" ? (
              <Button asChild className="bg-primary hover:bg-primary/90 shadow-md shadow-primary/30">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Button asChild className="bg-primary hover:bg-primary/90 shadow-md shadow-primary/30">
                <Link href="/register">Register Now</Link>
              </Button>
            )}
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
            <div className="px-2 pt-2 pb-3 space-y-1 
              backdrop-blur-xl border border-white/20 rounded-lg mt-2 shadow-lg">
              <Link
                href="/"
                className="block px-3 py-2 text-white hover:text-primary transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/#our-teams"
                className="block px-3 py-2 text-white hover:text-primary transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Our Teams
              </Link>
              <Link
                href="/events"
                className="block px-3 py-2 text-white hover:text-primary transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Events
              </Link>
              <Link
                href="/merch"
                className="block px-3 py-2 text-white hover:text-primary transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Merch
              </Link>
              <Link
                href="/gallery"
                className="block px-3 py-2 text-white hover:text-primary transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Gallery
              </Link>
              <div className="px-3 py-2">
                <Button asChild className="w-full bg-primary hover:bg-primary/90 shadow-md shadow-primary/30">
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
