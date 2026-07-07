"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  getAnubhav,
  extractWisdom,
  deleteAnubhav,
  createReminder,
  deleteReminder,
  getRelatedAnubhavs,
  getReminders,
} from "@/services/api"
import { Anubhav, RelatedItem, Reminder } from "@/types"
import {
  ArrowLeft, Sparkles, Bell, Trash2, Link2, Globe, ArrowRight, Clock
} from "lucide-react"

export default function ExperienceDetailPage() {
  const { id } = useParams()
  const router = useRouter()

  const [anubhav, setAnubhav] = useState<Anubhav | null>(null)
  const [loading, setLoading] = useState(true)
  const [extracting, setExtracting] = useState(false)

  const [reminderDate, setReminderDate] = useState("")
  const [settingReminder, setSettingReminder] = useState(false)
  const [reminders, setReminders] = useState<Reminder[]>([])

  const [related, setRelated] = useState<RelatedItem[]>([])
  const [loadingRelated, setLoadingRelated] = useState(false)

  const [error, setError] = useState("")

  const loadEverything = async () => {
    try {
      const data = await getAnubhav(id as string)
      setAnubhav(data)

      const [relData, remData] = await Promise.all([
        getRelatedAnubhavs(id as string, 5).catch(() => ({ items: [] })),
        getReminders(1, 100).catch(() => ({ items: [] })),
      ])
      setRelated(relData?.items || [])
      setReminders(
        (remData?.items || []).filter((r: Reminder) => r.anubhav_id === id)
      )
    } catch (e) {
      router.push("/experiences")
    } finally {
      setLoading(false)
      setLoadingRelated(false)
    }
  }

  useEffect(() => {
    setLoadingRelated(true)
    loadEverything()
  }, [id])

  const handleExtract = async () => {
    if (!anubhav) return
    setExtracting(true)
    setError("")
    try {
      await extractWisdom(anubhav.id)
      await loadEverything()
    } catch (e: any) {
      if (e?.response?.status === 409) {
        setError("Wisdom already extracted")
      } else {
        setError("Extraction failed. Please try again.")
      }
    } finally {
      setExtracting(false)
    }
  }

  const handleDelete = async () => {
    if (!anubhav) return
    if (!confirm("Delete this experience?")) return
    try {
      await deleteAnubhav(anubhav.id)
      router.push("/experiences")
    } catch (e) {
      setError("Failed to delete")
    }
  }

  const handleAddReminder = async () => {
    if (!anubhav || !reminderDate) return
    setSettingReminder(true)
    try {
      await createReminder({
        anubhav_id: anubhav.id,
        trigger_at: new Date(reminderDate).toISOString(),
      })
      setReminderDate("")
      await loadEverything()
    } catch (e) {
      setError("Failed to set reminder")
    } finally {
      setSettingReminder(false)
    }
  }

  const handleDeleteReminder = async (reminderId: string) => {
    try {
      await deleteReminder(reminderId)
      await loadEverything()
    } catch (e) {
      setError("Failed to delete reminder")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-stone-400 text-sm">Loading experience...</p>
      </div>
    )
  }

  if (!anubhav) return null

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Link href="/experiences" className="text-sm text-stone-400 hover:text-stone-600 flex items-center gap-1">
          <ArrowLeft size={14} /> Back to Experiences
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href={`/world?focus=${anubhav.id}`}
            className="text-xs px-3 py-1.5 bg-stone-800 text-white hover:bg-stone-700 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Globe size={12} /> Open in World
          </Link>
          <button onClick={handleDelete} className="text-stone-400 hover:text-red-500 transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Experience */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs px-2 py-1 bg-stone-100 text-stone-500 rounded-full capitalize">{anubhav.category}</span>
          <span className="text-xs text-stone-400">
            {new Date(anubhav.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </span>
        </div>
        <p className="text-stone-700 leading-relaxed">{anubhav.what_happened}</p>
        <p className="text-xs text-stone-400 capitalize">Source: {anubhav.source}</p>
      </div>

      {/* Wisdom */}
      {anubhav.lesson ? (
        <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider">Extracted Wisdom</h3>
          <div className="space-y-1">
            <p className="text-xs text-stone-400">Lesson</p>
            <p className="text-stone-800 font-medium">{anubhav.lesson}</p>
          </div>
          {anubhav.summary && (
            <div className="space-y-1">
              <p className="text-xs text-stone-400">Summary</p>
              <p className="text-stone-600 text-sm leading-relaxed">{anubhav.summary}</p>
            </div>
          )}
          {anubhav.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {anubhav.tags.map(tag => (
                <span key={tag.id} className="text-xs px-2 py-0.5 bg-stone-100 text-stone-500 rounded-full">{tag.name}</span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white border border-stone-200 border-dashed rounded-xl p-6 text-center space-y-3">
          <p className="text-stone-400 text-sm">No wisdom extracted yet.</p>
          <button
            onClick={handleExtract}
            disabled={extracting}
            className="px-6 py-2 bg-stone-800 hover:bg-stone-700 text-white text-sm rounded-lg transition-colors flex items-center gap-2 mx-auto disabled:opacity-50"
          >
            <Sparkles size={14} />
            {extracting ? "Extracting..." : "Extract Wisdom with AI"}
          </button>
        </div>
      )}

      {/* Related Wisdom */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider flex items-center gap-2">
          <Link2 size={14} /> Related Wisdom
        </h3>
        {loadingRelated ? (
          <p className="text-sm text-stone-400">Discovering connections...</p>
        ) : related.length === 0 ? (
          <p className="text-sm text-stone-400">No related experiences yet. Extract wisdom to build connections.</p>
        ) : (
          <div className="space-y-2">
            {related.map(item => (
              <Link
                key={item.id}
                href={`/experiences/${item.id}`}
                className="block p-4 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 bg-white text-stone-500 rounded-full capitalize border border-stone-200">
                        {item.category}
                      </span>
                      <span className="text-xs text-stone-400">
                        {Math.round(item.similarity_score * 100)}% match
                      </span>
                    </div>
                    <p className="text-sm text-stone-700 line-clamp-2">
                      {item.lesson || item.what_happened}
                    </p>
                  </div>
                  <ArrowRight size={14} className="text-stone-300 group-hover:text-stone-600 transition-colors mt-1" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Reminders */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider flex items-center gap-2">
          <Bell size={14} /> Reminders
        </h3>

        {reminders.length > 0 && (
          <div className="space-y-2">
            {reminders.map(r => (
              <div key={r.id} className="flex items-center justify-between p-3 bg-stone-50 border border-stone-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock size={14} className="text-stone-500" />
                  <div>
                    <p className="text-sm text-stone-700">
                      {new Date(r.trigger_at).toLocaleDateString("en-US", {
                        weekday: "long", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                      })}
                    </p>
                    <p className="text-xs text-stone-400 capitalize">Status: {r.status}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteReminder(r.id)}
                  className="text-stone-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          <input
            type="datetime-local"
            value={reminderDate}
            onChange={e => setReminderDate(e.target.value)}
            className="flex-1 px-3 py-2 text-sm border border-stone-200 rounded-lg text-stone-700 focus:outline-none focus:ring-1 focus:ring-stone-300"
          />
          <button
            onClick={handleAddReminder}
            disabled={!reminderDate || settingReminder}
            className="px-4 py-2 text-sm bg-stone-800 text-white rounded-lg hover:bg-stone-700 disabled:opacity-40"
          >
            {settingReminder ? "Adding..." : "Add Reminder"}
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}