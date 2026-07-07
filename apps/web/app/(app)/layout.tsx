"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { setAuthToken } from "@/services/api"
import Navigation from "@/components/navigation/Navigation"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth()
  const router = useRouter()

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