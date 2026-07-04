"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getAnubhavs } from "@/services/api"
import { Anubhav } from "@/types"

function groupByMonth(items: Anubhav[]) {
  const groups: Record<string, Anubhav[]> = {}
  items.forEach(item => {
    const key = new Date(item.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long" })
    if (!groups[key]) groups[key] = []
    groups[key].push(item)
  })
  return groups
}

export default function JourneyPage() {
  const [anubhavs, setAnubhavs] = useState<Anubhav[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAnubhavs(1, 100)
        const sorted = [...(data?.items || [])].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        setAnubhavs(sorted)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const groups = groupByMonth(anubhavs)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-stone-400 text-sm">Loading your journey...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-light text-stone-800">My Journey</h2>
        <p className="text-stone-400 mt-1">Your experiences through time</p>
      </div>

      {anubhavs.length === 0 ? (
        <div className="p-12 text-center border border-stone-200 border-dashed rounded-xl bg-white">
          <p className="text-stone-400">No experiences yet.</p>
          <Link href="/experiences/new" className="text-sm text-stone-500 mt-2 inline-block hover:underline">
            Capture your first experience
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(groups).map(([month, items]) => (
            <div key={month} className="space-y-4">
              <div className="flex items-center gap-4">
                <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider whitespace-nowrap">{month}</h3>
                <div className="flex-1 h-px bg-stone-200" />
                <span className="text-xs text-stone-400">{items.length}</span>
              </div>
              <div className="space-y-3 pl-4 border-l-2 border-stone-100">
                {items.map(item => (
                  <Link key={item.id} href={`/experiences/${item.id}`} className="block p-4 bg-white border border-stone-200 rounded-xl hover:shadow-md transition-shadow group ml-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 flex-1 min-w-0">
                        <p className="text-sm text-stone-700 line-clamp-2 group-hover:text-stone-900">{item.what_happened}</p>
                        {item.lesson && (
                          <p className="text-xs text-stone-400 italic">"{item.lesson}"</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-xs px-2 py-1 bg-stone-100 text-stone-500 rounded-full capitalize">{item.category}</span>
                        <span className="text-xs text-stone-400">
                          {new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}