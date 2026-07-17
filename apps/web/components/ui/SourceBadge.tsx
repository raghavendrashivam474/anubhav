"use client"

import { Book, User as UserIcon, Users, Headphones, Eye } from "lucide-react"

interface SourceBadgeProps {
  source: string
  className?: string
}

/**
 * Displays a small badge indicating the source of a wisdom entry.
 *
 * By design:
 *   - "myself" shows no badge (default source, existing behavior preserved)
 *   - All non-myself sources show a subtle icon + label
 *
 * This keeps the UI clean while making multi-source entries scannable.
 */
export function SourceBadge({ source, className = "" }: SourceBadgeProps) {
  const normalized = (source || "").toLowerCase()

  // Default source - no badge, keeps existing UI unchanged
  if (normalized === "myself" || !normalized) return null

  const config: Record<string, { icon: any; label: string; color: string }> = {
    book: {
      icon: Book,
      label: "Book",
      color: "bg-amber-50 text-amber-700 border-amber-200",
    },
    friend: {
      icon: Users,
      label: "Friend",
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    podcast: {
      icon: Headphones,
      label: "Podcast",
      color: "bg-purple-50 text-purple-700 border-purple-200",
    },
    observation: {
      icon: Eye,
      label: "Observation",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
  }

  const entry = config[normalized]
  if (!entry) return null

  const Icon = entry.icon
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${entry.color} ${className}`}
    >
      <Icon size={10} />
      {entry.label}
    </span>
  )
}
