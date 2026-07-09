"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function WisdomSpaceRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/world")
  }, [router])

  return (
    <div className="flex items-center justify-center h-64">
      <p className="text-stone-400 text-sm">Redirecting to your world...</p>
    </div>
  )
}