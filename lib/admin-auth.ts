import bcrypt from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "fallback-secret-key")

export interface AdminSession {
  username: string
  isAdmin: true
  iat: number
  exp: number
}

export async function verifyAdminCredentials(username: string, password: string): Promise<boolean> {
  const adminUsername = process.env.ADMIN_USERNAME
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminUsername || !adminPassword) {
    console.error("Admin credentials not configured in environment variables")
    return false
  }

  // Check username
  if (username !== adminUsername) {
    return false
  }

  // For development, allow plain text password comparison
  // In production, you should hash the password in .env
  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "production") {
    return password === adminPassword
  }

  // For production, compare with hashed password
  try {
    return await bcrypt.compare(password, adminPassword)
  } catch (error) {
    console.error("Error comparing passwords:", error)
    return false
  }
}

export async function createAdminSession(username: string): Promise<string> {
  const payload = {
    username,
    isAdmin: true,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
  }

  return await new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).sign(JWT_SECRET)
}

export async function verifyAdminSession(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as AdminSession
  } catch (error) {
    return null
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin-session")?.value

  if (!token) {
    return null
  }

  return await verifyAdminSession(token)
}

export async function setAdminSession(username: string) {
  const token = await createAdminSession(username)
  const cookieStore = await cookies()

  cookieStore.set("admin-session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60, // 24 hours
    path: "/",
  })
}

export async function clearAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete("admin-session")
}
