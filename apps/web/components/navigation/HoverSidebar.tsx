"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { setAuthToken } from "@/services/api"
import { Home, BookOpen, Search, Clock, Bell, Settings, LogOut, Globe } from "lucide-react"

const navItems = [
  { href: "/world", label: "World", icon: Globe },
  { href: "/experiences", label: "Experiences", icon: BookOpen },
  { href: "/search", label: "Search", icon: Search },
  { href: "/journey", label: "Journey", icon: Clock },
  { href: "/reflections", label: "Reflections", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings },
]

export default function HoverSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [visible, setVisible] = useState(false)
  const hideTimer = useRef<NodeJS.Timeout | null>(null)

  const handleLogout = () => {
    setAuthToken(null)
    logout()
    router.push("/")
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientX < 32) {
        if (hideTimer.current) {
          clearTimeout(hideTimer.current)
          hideTimer.current = null
        }
        setVisible(true)
      }
    }

    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault()
        setVisible(v => !v)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("keydown", handleKey)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("keydown", handleKey)
    }
  }, [])

  const handleSidebarLeave = () => {
    hideTimer.current = setTimeout(() => setVisible(false), 500)
  }

  const handleSidebarEnter = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current)
      hideTimer.current = null
    }
  }

  return (
    <>
      {/* Trigger zone */}
      <div
        className="fixed left-0 top-0 w-8 h-full z-40"
        onMouseEnter={() => setVisible(true)}
      />

      {/* Sidebar */}
      <nav
        onMouseEnter={handleSidebarEnter}
        onMouseLeave={handleSidebarLeave}
        className={`fixed left-0 top-0 h-full w-56 bg-slate-950/95 backdrop-blur-md border-r border-slate-800 flex flex-col z-50 transition-transform duration-300 ${
          visible ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-6 py-6 border-b border-slate-800">
          <h1 className="text-lg font-semibold text-slate-100">Anubhav</h1>
          <p className="text-xs text-slate-500 mt-0.5">Wisdom World</p>
        </div>

        <div className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setVisible(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-slate-800 text-slate-100 font-medium"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="px-6 py-4 border-t border-slate-800">
          {user && (
            <p className="text-xs text-slate-500 mb-3 truncate">{user.email}</p>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-400 transition-colors w-full"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </nav>
    </>
  )
}