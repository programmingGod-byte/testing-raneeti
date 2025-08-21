import type React from "react"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import { SessionProvider } from "@/components/session-provider"
import "./globals.css"
import { CustomCursor } from "@/components/custonCursor"

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "RANN-NEETI | IIT Mandi Sports Festival",
  description:
    "Join the ultimate sports festival at IIT Mandi - RANN-NEETI. Embrace the spirit of the Gods of Olympus.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} dark`}>
      <body>
        {/* <CustomCursor */}
        <CustomCursor imageUrl="/background.png" /> 
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
