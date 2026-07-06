"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { getAnubhavs, getReminders } from "@/services/api"
import { Anubhav, Reminder } from "@/types"
import { Plus, Search, Bell, ArrowRight, Globe } from "lucide-react"
import TodaysReflections from "@/components/reflections/TodaysReflections"

export default function WisdomSpacePage() {
  const { user } = useAuth()
  const [anubhavs, setAnubhavs] = useState<Anubhav[]>([])
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [a, r] = await Promise.all([getAnubhavs(1, 5), getReminders(1, 5)])
        setAnubhavs(a?.items || [])
        setReminders((r?.items || []).filter((x: Reminder) => x.status === "pending"))
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-stone-400 text-sm">Loading your wisdom space...</p>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-light text-stone-800">
          Welcome back{user?.name ? `, ${user.name}` : ""}.
        </h2>
        <p className="text-stone-400 mt-1">What would you like to reflect on today?</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Link href="/experiences/new" className="p-5 bg-white border border-stone-200 rounded-xl hover:shadow-md transition-shadow flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-stone-200 transition-colors">
            <Plus size={16} className="text-stone-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-stone-800">New Experience</p>
            <p className="text-xs text-stone-400">Capture a moment</p>
          </div>
        </Link>

        <Link href="/world" className="p-5 bg-white border border-stone-200 rounded-xl hover:shadow-md transition-shadow flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-stone-200 transition-colors">
            <Globe size={16} className="text-stone-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-stone-800">My World</p>
            <p className="text-xs text-stone-400">Explore</p>
          </div>
        </Link>

        <Link href="/search" className="p-5 bg-white border border-stone-200 rounded-xl hover:shadow-md transition-shadow flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-stone-200 transition-colors">
            <Search size={16} className="text-stone-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-stone-800">Search</p>
            <p className="text-xs text-stone-400">Find wisdom</p>
          </div>
        </Link>

        <Link href="/reflections" className="p-5 bg-white border border-stone-200 rounded-xl hover:shadow-md transition-shadow flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-stone-200 transition-colors">
            <Bell size={16} className="text-stone-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-stone-800">Reflections</p>
            <p className="text-xs text-stone-400">{reminders.length} upcoming</p>
          </div>
        </Link>
      </div>

      <TodaysReflections />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider">Recent Experiences</h3>
          <Link href="/experiences" className="text-xs text-stone-400 hover:text-stone-600 flex items-center gap-1">
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {anubhavs.length === 0 ? (
          <div className="p-8 text-center border border-stone-200 border-dashed rounded-xl bg-white">
            <p className="text-stone-400 text-sm">No experiences yet.</p>
            <Link href="/experiences/new" className="text-xs text-stone-500 mt-2 inline-block hover:underline">
              Capture your first experience
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {anubhavs.map((item) => (
              <Link key={item.id} href={`/world?focus=${item.id}`} className="block p-5 bg-white border border-stone-200 rounded-xl hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 flex-1 min-w-0">
                    <p className="text-sm text-stone-700 line-clamp-2">{item.what_happened}</p>
                    {item.lesson && (
                      <p className="text-xs text-stone-400 italic">"{item.lesson}"</p>
                    )}
                  </div>
                  <span className="text-xs px-2 py-1 bg-stone-100 text-stone-500 rounded-full capitalize shrink-0">
                    {item.category}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}