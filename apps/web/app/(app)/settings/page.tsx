"use client"

import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { setAuthToken } from "@/services/api"

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    setAuthToken(null)
    logout()
    router.push("/")
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-3xl font-light text-stone-800">Settings</h2>
        <p className="text-stone-400 mt-1">Manage your account</p>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider">Profile</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-stone-500">Name</span>
            <span className="text-stone-700">{user?.name || "Not set"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-stone-500">Email</span>
            <span className="text-stone-700">{user?.email}</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-3">
        <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider">About</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-stone-500">Product</span>
            <span className="text-stone-700">Anubhav</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-stone-500">Version</span>
            <span className="text-stone-700">0.1.0 MVP</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-stone-500">Mission</span>
            <span className="text-stone-700">Preserve wisdom. Retrieve meaning.</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-stone-700">Sign Out</p>
            <p className="text-xs text-stone-400 mt-0.5">You can sign back in anytime.</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm border border-stone-300 text-stone-600 hover:bg-stone-50 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}