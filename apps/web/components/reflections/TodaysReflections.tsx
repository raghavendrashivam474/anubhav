"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getTodaysReflections } from "@/services/api"
import { ReflectionItem } from "@/types"
import { Bell, Clock, Link2, Sparkles, ArrowRight } from "lucide-react"

const TYPE_META: Record<string, { label: string; icon: any; color: string }> = {
  reminder: {
    label: "Reminder Due",
    icon: Bell,
    color: "text-amber-600 bg-amber-50 border-amber-200",
  },
  forgotten: {
    label: "Forgotten Wisdom",
    icon: Clock,
    color: "text-stone-600 bg-stone-50 border-stone-200",
  },
  relationship: {
    label: "Connected Wisdom",
    icon: Link2,
    color: "text-blue-600 bg-blue-50 border-blue-200",
  },
  random: {
    label: "Worth Revisiting",
    icon: Sparkles,
    color: "text-purple-600 bg-purple-50 border-purple-200",
  },
}

export default function TodaysReflections() {
  const router = useRouter()
  const [reflections, setReflections] = useState<ReflectionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getTodaysReflections(5)
        setReflections(data?.items || [])
      } catch (e) {
        console.error(e)
        setError("Could not load today's reflections")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const openInWorld = (id: string) => {
    router.push(`/world?focus=${id}`)
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider">Today's Reflections</h3>
        <div className="p-6 bg-white border border-stone-200 rounded-xl">
          <p className="text-stone-400 text-sm">Loading reflections...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider">Today's Reflections</h3>
        <div className="p-6 bg-white border border-stone-200 rounded-xl">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (reflections.length === 0) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider">Today's Reflections</h3>
        <div className="p-8 bg-white border border-stone-200 border-dashed rounded-xl text-center">
          <p className="text-stone-400 text-sm">No reflections for today.</p>
          <p className="text-xs text-stone-400 mt-1">Capture more experiences and connections will appear.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider">Today's Reflections</h3>
      <div className="space-y-2">
        {reflections.map(item => {
          const meta = TYPE_META[item.reflection_type] || TYPE_META.random
          const Icon = meta.icon
          return (
            <button
              key={item.id}
              onClick={() => openInWorld(item.id)}
              className="w-full text-left p-4 bg-white border border-stone-200 rounded-xl hover:shadow-md hover:border-stone-300 transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center border ${meta.color}`}>
                  <Icon size={14} />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${meta.color}`}>
                      {meta.label}
                    </span>
                    <span className="text-xs text-stone-400 capitalize">{item.category}</span>
                  </div>
                  <p className="text-sm font-medium text-stone-800 line-clamp-1">{item.title}</p>
                  <p className="text-xs text-stone-500 line-clamp-1">{item.reason}</p>
                </div>
                <ArrowRight size={14} className="text-stone-300 group-hover:text-stone-600 transition-colors mt-2" />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}