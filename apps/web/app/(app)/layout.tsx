"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { setAuthToken } from "@/services/api"
import Navigation from "@/components/navigation/Navigation"
import HoverSidebar from "@/components/navigation/HoverSidebar"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Set token synchronously so children can make authed API calls immediately
  if (token) {
    setAuthToken(token)
  }

  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/sign-in")
    }
  }, [token, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-stone-400 text-sm">Loading...</p>
      </div>
    )
  }

  if (!token) return null

  // World page — full-screen immersive with hover sidebar
  const isWorldPage = pathname === "/world"

  if (isWorldPage) {
    return (
      <div className="w-screen h-screen overflow-hidden">
        <HoverSidebar />
        {children}
      </div>
    )
  }

  // All other pages — traditional sidebar layout
  return (
    <div className="min-h-screen bg-stone-50 flex">
      <Navigation />
      <main className="flex-1 ml-56 p-8">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}