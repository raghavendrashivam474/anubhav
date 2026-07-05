"use client"

import { useState } from "react"
import { Island } from "../types"
import { extractWisdom, createReminder, deleteAnubhav } from "@/services/api"
import { X, Sparkles, Bell, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface ExperienceDockProps {
  island: Island | null
  onClose: () => void
  onWisdomExtracted: (id: string) => void
}

export default function ExperienceDock({
  island,
  onClose,
  onWisdomExtracted,
}: ExperienceDockProps) {
  const router = useRouter()
  const [extracting, setExtracting] = useState(false)
  const [reminderDate, setReminderDate] = useState("")
  const [settingReminder, setSettingReminder] = useState(false)
  const [reminderSet, setReminderSet] = useState(false)
  const [error, setError] = useState("")

  if (!island) return null

  const anubhav = island.raw

  const handleExtract = async () => {
    setExtracting(true)
    setError("")
    try {
      await extractWisdom(anubhav.id)
      onWisdomExtracted(anubhav.id)
    } catch (e: any) {
      if (e?.response?.status === 409) {
        setError("Wisdom already extracted")
      } else {
        setError("Extraction failed")
      }
    } finally {
      setExtracting(false)
    }
  }

  const handleReminder = async () => {
    if (!reminderDate) return
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

  const handleDelete = async () => {
    if (!confirm("Delete this experience?")) return
    try {
      await deleteAnubhav(anubhav.id)
      onClose()
      router.refresh()
    } catch (e) {
      setError("Failed to delete")
    }
  }

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-stone-900 border-l border-stone-700 z-50 flex flex-col shadow-2xl">
      {/* Header */}
      <div className="px-6 py-5 border-b border-stone-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: `var(--category-${island.category}, #888)` }}
          />
          <span className="text-xs text-stone-400 uppercase tracking-wider capitalize">
            {island.category}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDelete}
            className="text-stone-500 hover:text-red-400 transition-colors"
          >
            <Trash2 size={14} />
          </button>
          <button
            onClick={onClose}
            className="text-stone-500 hover:text-stone-300 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        {/* Experience */}
        <div className="space-y-2">
          <p className="text-xs text-stone-500 uppercase tracking-wider">Experience</p>
          <p className="text-stone-200 text-sm leading-relaxed">{anubhav.what_happened}</p>
          <p className="text-xs text-stone-500 capitalize">Source: {anubhav.source}</p>
        </div>

        {/* Wisdom */}
        {anubhav.lesson ? (
          <div className="space-y-4">
            <p className="text-xs text-stone-500 uppercase tracking-wider">Wisdom</p>
            <div className="space-y-1">
              <p className="text-xs text-stone-500">Lesson</p>
              <p className="text-stone-100 font-medium text-sm">{anubhav.lesson}</p>
            </div>
            {anubhav.summary && (
              <div className="space-y-1">
                <p className="text-xs text-stone-500">Summary</p>
                <p className="text-stone-300 text-sm leading-relaxed">{anubhav.summary}</p>
              </div>
            )}
            {anubhav.tags?.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {anubhav.tags.map((tag: any) => (
                  <span key={tag.id} className="text-xs px-2 py-0.5 bg-stone-700 text-stone-300 rounded-full">
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4 space-y-3">
            <p className="text-stone-500 text-sm">No wisdom extracted yet.</p>
            <button
              onClick={handleExtract}
              disabled={extracting}
              className="flex items-center gap-2 px-4 py-2 bg-stone-700 hover:bg-stone-600 text-stone-200 text-sm rounded-lg transition-colors mx-auto disabled:opacity-50"
            >
              <Sparkles size={14} />
              {extracting ? "Extracting..." : "Extract Wisdom"}
            </button>
          </div>
        )}

        {/* Reminder */}
        <div className="space-y-3">
          <p className="text-xs text-stone-500 uppercase tracking-wider flex items-center gap-2">
            <Bell size={12} /> Reminder
          </p>
          {reminderSet ? (
            <p className="text-sm text-stone-400">Reminder set.</p>
          ) : (
            <div className="flex gap-2">
              <input
                type="datetime-local"
                value={reminderDate}
                onChange={e => setReminderDate(e.target.value)}
                className="flex-1 px-3 py-2 text-xs bg-stone-800 border border-stone-600 rounded-lg text-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-500"
              />
              <button
                onClick={handleReminder}
                disabled={!reminderDate || settingReminder}
                className="px-3 py-2 text-xs bg-stone-700 hover:bg-stone-600 text-stone-300 rounded-lg disabled:opacity-40"
              >
                Set
              </button>
            </div>
          )}
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-stone-700">
        <p className="text-xs text-stone-600">
          {new Date(anubhav.created_at).toLocaleDateString("en-US", {
            year: "numeric", month: "long", day: "numeric"
          })}
        </p>
      </div>
    </div>
  )
}