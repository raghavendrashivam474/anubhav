"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { register, setAuthToken } from "@/services/api"

export default function SignUpPage() {
  const router = useRouter()
  const { login: authLogin } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const data = await register(email, password, name)
      setAuthToken(data.token)
      authLogin(data.token, data.user)
      router.push("/world")
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm">
      <h2 className="text-xl font-light text-stone-800 mb-6 text-center">Begin your journey</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-stone-600 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-4 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-700 focus:outline-none focus:ring-1 focus:ring-stone-400"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-sm text-stone-600 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-700 focus:outline-none focus:ring-1 focus:ring-stone-400"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm text-stone-600 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-700 focus:outline-none focus:ring-1 focus:ring-stone-400"
            placeholder="At least 8 characters"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>
      <p className="text-center text-sm text-stone-400 mt-6">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-stone-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}