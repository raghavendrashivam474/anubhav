"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getAnubhavs } from "@/services/api"
import { Anubhav } from "@/types"
import { Plus, ChevronLeft, ChevronRight } from "lucide-react"

const CATEGORIES = ["all", "career", "relationships", "health", "money", "mindset", "life"]

export default function ExperiencesPage() {
  const [anubhavs, setAnubhavs] = useState<Anubhav[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [category, setCategory] = useState("all")
  const [loading, setLoading] = useState(true)
  const pageSize = 10

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const data = await getAnubhavs(page, pageSize, category === "all" ? undefined : category)
        setAnubhavs(data?.items || [])
        setTotal(data?.total || 0)
      } catch (e) {
        console.error(e)
        setAnubhavs([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [page, category])

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-light text-stone-800">My Experiences</h2>
          <p className="text-stone-400 mt-1">{total} captured moments</p>
        </div>
        <Link href="/experiences/new" className="px-4 py-2 text-sm bg-stone-800 hover:bg-stone-700 text-white rounded-lg transition-colors flex items-center gap-2">
          <Plus size={14} />
          New Experience
        </Link>
      </div>

      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => { setCategory(cat); setPage(1) }}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors capitalize ${
              category === cat
                ? "bg-stone-800 text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-stone-400 text-sm">Loading...</p>
        </div>
      ) : anubhavs.length === 0 ? (
        <div className="p-12 text-center border border-stone-200 border-dashed rounded-xl bg-white">
          <p className="text-stone-400">No experiences found.</p>
          <Link href="/experiences/new" className="text-sm text-stone-500 mt-2 inline-block hover:underline">
            Capture your first experience
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {anubhavs.map((item) => (
            <Link key={item.id} href={`/experiences/${item.id}`} className="block p-5 bg-white border border-stone-200 rounded-xl hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1 min-w-0">
                  <p className="text-sm text-stone-700 line-clamp-2 group-hover:text-stone-900 transition-colors">
                    {item.what_happened}
                  </p>
                  {item.lesson && (
                    <p className="text-xs text-stone-400 italic">"{item.lesson}"</p>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    {(item.tags || []).slice(0, 3).map((tag) => (
                      <span key={tag.id} className="text-xs px-2 py-0.5 bg-stone-100 text-stone-500 rounded-full">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="text-xs px-2 py-1 bg-stone-100 text-stone-500 rounded-full capitalize">
                    {item.category}
                  </span>
                  <span className="text-xs text-stone-400">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-50 disabled:opacity-40 flex items-center gap-1"
          >
            <ChevronLeft size={14} /> Previous
          </button>
          <span className="text-sm text-stone-500">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-sm border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-50 disabled:opacity-40 flex items-center gap-1"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  )
}