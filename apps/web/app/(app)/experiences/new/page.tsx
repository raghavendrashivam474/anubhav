"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createAnubhav } from "@/services/api"
import { ArrowLeft } from "lucide-react"

const CATEGORIES = ["career", "relationships", "health", "money", "mindset", "life"]
const SOURCES = ["myself", "friend", "book", "podcast", "observation"]

export default function NewExperiencePage() {
  const router = useRouter()
  const [whatHappened, setWhatHappened] = useState("")
  const [category, setCategory] = useState("life")
  const [source, setSource] = useState("myself")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (!whatHappened.trim()) {
      setError("Please describe your experience")
      return
    }
    setSaving(true)
    setError("")
    try {
      const created = await createAnubhav({
        what_happened: whatHappened,
        category,
        source,
      })
      router.push(`/experiences/${created.id}`)
    } catch (e) {
      setError("Failed to save experience")
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/experiences" className="text-sm text-stone-400 hover:text-stone-600 flex items-center gap-1">
          <ArrowLeft size={14} /> Back
        </Link>
        <div>
          <h2 className="text-3xl font-light text-stone-800">New Experience</h2>
          <p className="text-stone-400 mt-1">Capture what happened</p>
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-stone-600">What happened?</label>
          <textarea
            value={whatHappened}
            onChange={e => setWhatHappened(e.target.value)}
            placeholder="Describe the experience in your own words. Be as raw and honest as you like..."
            className="w-full min-h-40 px-4 py-3 border border-stone-200 rounded-lg text-sm text-stone-700 placeholder:text-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-300 resize-none"
          />
          <p className="text-xs text-stone-400">{whatHappened.length} characters</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-stone-600">Category</label>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm transition-colors capitalize ${
                  category === cat ? "bg-stone-800 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-stone-600">Source</label>
          <div className="flex gap-2 flex-wrap">
            {SOURCES.map(src => (
              <button
                key={src}
                onClick={() => setSource(src)}
                className={`px-4 py-1.5 rounded-full text-sm transition-colors capitalize ${
                  source === src ? "bg-stone-800 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {src}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={saving || !whatHappened.trim()}
            className="px-8 py-2.5 bg-stone-800 hover:bg-stone-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Experience"}
          </button>
        </div>
      </div>
    </div>
  )
}