"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getReminders, deleteReminder } from "@/services/api"
import { Reminder } from "@/types"
import { Bell, Trash2, Clock } from "lucide-react"

export default function ReflectionsPage() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = async () => {
    try {
      const data = await getReminders(1, 50)
      setReminders(data?.items || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: string) => {
    try {
      await deleteReminder(id)
      setReminders(prev => prev.filter(r => r.id !== id))
    } catch (e) {
      setError("Failed to delete reminder")
    }
  }

  const pending = reminders.filter(r => r.status === "pending")
  const completed = reminders.filter(r => r.status !== "pending")

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-stone-400 text-sm">Loading reflections...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-light text-stone-800">Reflections</h2>
        <p className="text-stone-400 mt-1">Scheduled moments to revisit your wisdom</p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider">Upcoming</h3>
          <span className="text-xs px-2 py-0.5 bg-stone-100 text-stone-500 rounded-full">{pending.length}</span>
        </div>

        {pending.length === 0 ? (
          <div className="p-8 text-center border border-stone-200 border-dashed rounded-xl bg-white">
            <Bell size={20} className="text-stone-300 mx-auto mb-2" />
            <p className="text-stone-400 text-sm">No upcoming reflections.</p>
            <p className="text-xs text-stone-400 mt-1">Set reminders from any experience page.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map(reminder => (
              <div key={reminder.id} className="p-5 bg-white border border-stone-200 rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center">
                    <Clock size={14} className="text-stone-500" />
                  </div>
                  <div>
                    <Link href={`/experiences/${reminder.anubhav_id}`} className="text-sm font-medium text-stone-700 hover:text-stone-900 hover:underline">
                      View Experience
                    </Link>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {new Date(reminder.trigger_at).toLocaleDateString("en-US", {
                        weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"
                      })}
                    </p>
                  </div>
                </div>
                <button onClick={() => handleDelete(reminder.id)} className="text-stone-400 hover:text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {completed.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-stone-400 uppercase tracking-wider">Completed</h3>
          <div className="space-y-3">
            {completed.map(reminder => (
              <div key={reminder.id} className="p-5 bg-white border border-stone-200 rounded-xl flex items-center justify-between gap-4 opacity-60">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-stone-50 flex items-center justify-center">
                    <Bell size={14} className="text-stone-400" />
                  </div>
                  <div>
                    <Link href={`/experiences/${reminder.anubhav_id}`} className="text-sm text-stone-500 hover:underline">
                      View Experience
                    </Link>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {new Date(reminder.trigger_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 bg-stone-100 text-stone-400 rounded-full">{reminder.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}