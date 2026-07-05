import { Island, Region, Connection, CATEGORY_COLORS, CATEGORY_LABELS } from "../types"

// Compact region layout — islands closer together
const REGION_CENTERS: Record<string, { x: number; y: number }> = {
  career:        { x: -300, y: -150 },
  relationships: { x: 300,  y: -150 },
  health:        { x: -300, y: 150 },
  money:         { x: 300,  y: 150 },
  mindset:       { x: 0,    y: -350 },
  life:          { x: 0,    y: 350 },
}

function getIslandPosition(
  category: string,
  indexInCategory: number,
  totalInCategory: number
): { x: number; y: number } {
  const center = REGION_CENTERS[category] || { x: 0, y: 0 }
  if (totalInCategory <= 1) return center

  const spread = 90
  const angle = (indexInCategory / totalInCategory) * 2 * Math.PI
  const radius = spread + (indexInCategory % 2) * 30
  return {
    x: center.x + Math.cos(angle) * radius,
    y: center.y + Math.sin(angle) * radius,
  }
}

export function mapExperiencesToIslands(experiences: any[]): Island[] {
  const countByCategory: Record<string, number> = {}
  const indexByCategory: Record<string, number> = {}

  experiences.forEach(exp => {
    countByCategory[exp.category] = (countByCategory[exp.category] || 0) + 1
  })

  return experiences.map(exp => {
    const cat = exp.category
    const idx = indexByCategory[cat] || 0
    indexByCategory[cat] = idx + 1

    const pos = getIslandPosition(cat, idx, countByCategory[cat])

    return {
      id: exp.id,
      x: pos.x,
      y: pos.y,
      radius: exp.lesson ? 42 : 34,
      category: cat,
      label: exp.what_happened.slice(0, 40) + (exp.what_happened.length > 40 ? "..." : ""),
      lesson: exp.lesson,
      hasReminder: false,
      hasWisdom: !!(exp.lesson && exp.summary),
      createdAt: exp.created_at,
      raw: exp,
    }
  })
}

export function mapCategoriesToRegions(islands: Island[]): Region[] {
  const categories = [...new Set(islands.map(i => i.category))]

  return categories.map(cat => {
    const catIslands = islands.filter(i => i.category === cat)
    const centerX = catIslands.reduce((s, i) => s + i.x, 0) / catIslands.length
    const centerY = catIslands.reduce((s, i) => s + i.y, 0) / catIslands.length

    return {
      id: cat,
      category: cat,
      label: CATEGORY_LABELS[cat] || cat,
      color: CATEGORY_COLORS[cat] || "#888",
      centerX,
      centerY,
      radius: Math.max(160, catIslands.length * 70),
    }
  })
}

export function buildConnections(islands: Island[]): Connection[] {
  const connections: Connection[] = []

  for (let i = 0; i < islands.length; i++) {
    for (let j = i + 1; j < islands.length; j++) {
      const a = islands[i]
      const b = islands[j]

      if (a.category !== b.category) continue

      const dx = a.x - b.x
      const dy = a.y - b.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 300) {
        const strength = 1 - distance / 300
        connections.push({
          id: `${a.id}-${b.id}`,
          fromIslandId: a.id,
          toIslandId: b.id,
          strength,
        })
      }
    }
  }

  return connections
}