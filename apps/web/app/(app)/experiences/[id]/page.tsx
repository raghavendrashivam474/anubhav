"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { getAnubhav, extractWisdom, deleteAnubhav, createReminder } from "@/services/api"
import { Anubhav } from "@/types"
import { ArrowLeft, Sparkles, Bell, Trash2 } from "lucide-react"

export default function ExperienceDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [anubhav, setAnubhav] = useState<Anubhav | null>(null)
  const [loading, setLoading] = useState(true)
  const [extracting, setExtracting] = useState(false)
  const [reminderDate, setReminderDate] = useState("")
  const [settingReminder, setSettingReminder] = useState(false)
  const [reminderSet, setReminderSet] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAnubhav(id as string)
        setAnubhav(data)
      } catch (e) {
        router.push("/experiences")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, router])

  const handleExtract = async () => {
    if (!anubhav) return
    setExtracting(true)
    setError("")
    try {
      await extractWisdom(anubhav.id)
      const updated = await getAnubhav(anubhav.id)
      setAnubhav(updated)
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

  const handleReminder = async () => {
    if (!anubhav || !reminderDate) return
    setSettingReminder(true)
    try {
      await createReminder({
        anubhav_id: anubhav.id,
        trigger_at: new Date(reminderDate).toISOString(),
      })
      setReminderSet(true)
      setReminderDate("")
    } catch (e) {
      setError("Failed to set reminder")
    } finally {
      setSettingReminder(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-stone-400 text-sm">Loading...</p>
      </div>
    )
  }

  if (!anubhav) return null

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <Link href="/experiences" className="text-sm text-stone-400 hover:text-stone-600 flex items-center gap-1">
          <ArrowLeft size={14} /> Back
        </Link>
        <button onClick={handleDelete} className="text-stone-400 hover:text-red-500 transition-colors">
          <Trash2 size={16} />
        </button>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs px-2 py-1 bg-stone-100 text-stone-500 rounded-full capitalize">{anubhav.category}</span>
          <span className="text-xs text-stone-400">{new Date(anubhav.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
        </div>
        <p className="text-stone-700 leading-relaxed">{anubhav.what_happened}</p>
        <p className="text-xs text-stone-400 capitalize">Source: {anubhav.source}</p>
      </div>

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

      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider flex items-center gap-2">
          <Bell size={14} /> Set a Reminder
        </h3>
        {reminderSet ? (
          <p className="text-sm text-stone-500">Reminder set successfully.</p>
        ) : (
          <div className="flex gap-3">
            <input
              type="datetime-local"
              value={reminderDate}
              onChange={e => setReminderDate(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-stone-200 rounded-lg text-stone-700 focus:outline-none focus:ring-1 focus:ring-stone-300"
            />
            <button
              onClick={handleReminder}
              disabled={!reminderDate || settingReminder}
              className="px-4 py-2 text-sm border border-stone-300 text-stone-600 rounded-lg hover:bg-stone-50 disabled:opacity-40"
            >
              {settingReminder ? "Setting..." : "Set"}
            </button>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}