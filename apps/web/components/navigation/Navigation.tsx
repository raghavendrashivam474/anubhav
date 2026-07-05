"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { setAuthToken } from "@/services/api"
import { Home, BookOpen, Search, Clock, Bell, Settings, LogOut, Globe } from "lucide-react"

const navItems = [
  { href: "/wisdom-space", label: "Wisdom Space", icon: Home },
  { href: "/world", label: "My World", icon: Globe },
  { href: "/experiences", label: "My Experiences", icon: BookOpen },
  { href: "/search", label: "Search", icon: Search },
  { href: "/journey", label: "My Journey", icon: Clock },
  { href: "/reflections", label: "Reflections", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings },
]

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    setAuthToken(null)
    logout()
    router.push("/")
  }

  return (
    <nav className="fixed left-0 top-0 h-full w-56 bg-white border-r border-stone-200 flex flex-col z-50">
      <div className="px-6 py-6 border-b border-stone-100">
        <h1 className="text-lg font-semibold text-stone-800">Anubhav</h1>
        <p className="text-xs text-stone-400 mt-0.5">Wisdom Space</p>
      </div>

      <div className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-stone-100 text-stone-900 font-medium"
                  : "text-stone-500 hover:text-stone-800 hover:bg-stone-50"
              }`}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          )
        })}
      </div>

      <div className="px-6 py-4 border-t border-stone-100">
        {user && (
          <p className="text-xs text-stone-400 mb-3 truncate">{user.email}</p>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-stone-500 hover:text-red-600 transition-colors w-full"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </nav>
  )
}