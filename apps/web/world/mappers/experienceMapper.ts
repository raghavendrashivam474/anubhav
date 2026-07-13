import { Island, Region, Connection, CATEGORY_COLORS, CATEGORY_LABELS } from "../types"

const REGION_CENTERS: Record<string, { x: number; y: number }> = {
  career:        { x: -500, y: -400 },
  relationships: { x: 500,  y: -400 },
  health:        { x: -500, y: 200 },
  money:         { x: 500,  y: 200 },
  mindset:       { x: 0,    y: -650 },
  life:          { x: 0,    y: 550 },
}

interface IslandNode {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  category: string
  radius: number
  raw: any
}

function forceDirectedLayout(
  nodes: IslandNode[],
  connections: { source: string; target: string; strength: number }[],
  iterations: number = 100
): void {
  const REPULSION = 15000
  const ATTRACTION = 0.08
  const CATEGORY_GRAVITY = 0.04
  const DAMPING = 0.82
  const MIN_DISTANCE = 140

  for (let iter = 0; iter < iterations; iter++) {
    const progress = iter / iterations
    const coolingFactor = 1 - progress * 0.8

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i]
        const b = nodes[j]
        let dx = a.x - b.x
        let dy = a.y - b.y
        let dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 1) { dx = Math.random() - 0.5; dy = Math.random() - 0.5; dist = 1 }

        const force = (REPULSION * coolingFactor) / (dist * dist)
        const fx = (dx / dist) * force
        const fy = (dy / dist) * force

        a.vx += fx
        a.vy += fy
        b.vx -= fx
        b.vy -= fy

        if (dist < MIN_DISTANCE) {
          const push = (MIN_DISTANCE - dist) / 2
          const px = (dx / dist) * push
          const py = (dy / dist) * push
          a.x += px; a.y += py
          b.x -= px; b.y -= py
        }
      }
    }

    for (const conn of connections) {
      const a = nodes.find(n => n.id === conn.source)
      const b = nodes.find(n => n.id === conn.target)
      if (!a || !b) continue

      const dx = b.x - a.x
      const dy = b.y - a.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 1) continue

      // Only attract if distance is large — prevent over-clustering
      if (dist > 250) {
        const force = (dist - 250) * ATTRACTION * conn.strength * coolingFactor
        const fx = (dx / dist) * force
        const fy = (dy / dist) * force
        a.vx += fx
        a.vy += fy
        b.vx -= fx
        b.vy -= fy
      }
    }

    for (const node of nodes) {
      const center = REGION_CENTERS[node.category] || { x: 0, y: 0 }
      const dx = center.x - node.x
      const dy = center.y - node.y
      node.vx += dx * CATEGORY_GRAVITY * coolingFactor
      node.vy += dy * CATEGORY_GRAVITY * coolingFactor
    }

    for (const node of nodes) {
      node.vx *= DAMPING
      node.vy *= DAMPING
      node.x += node.vx
      node.y += node.vy
    }
  }
}

export function mapExperiencesToIslands(
  experiences: any[],
  connectionData?: { source_id: string; target_id: string; similarity_score: number }[]
): Island[] {
  if (experiences.length === 0) return []

  const nodes: IslandNode[] = experiences.map(exp => {
    const center = REGION_CENTERS[exp.category] || { x: 0, y: 0 }
    return {
      id: exp.id,
      x: center.x + (Math.random() - 0.5) * 300,
      y: center.y + (Math.random() - 0.5) * 300,
      vx: 0,
      vy: 0,
      category: exp.category,
      radius: exp.lesson ? 42 : 34,
      raw: exp,
    }
  })

  const simConnections = (connectionData || []).map(c => ({
    source: c.source_id,
    target: c.target_id,
    strength: c.similarity_score,
  }))

  forceDirectedLayout(nodes, simConnections)

  return nodes.map(node => ({
    id: node.id,
    x: node.x,
    y: node.y,
    radius: node.radius,
    category: node.category,
    label: node.raw.what_happened.slice(0, 40) + (node.raw.what_happened.length > 40 ? "..." : ""),
    lesson: node.raw.lesson,
    hasReminder: false,
    hasWisdom: !!(node.raw.lesson && node.raw.summary),
    createdAt: node.raw.created_at,
    raw: node.raw,
  }))
}

export function mapCategoriesToRegions(islands: Island[]): Region[] {
  const categories = [...new Set(islands.map(i => i.category))]

  return categories.map(cat => {
    const catIslands = islands.filter(i => i.category === cat)
    const centerX = catIslands.reduce((s, i) => s + i.x, 0) / catIslands.length
    const centerY = catIslands.reduce((s, i) => s + i.y, 0) / catIslands.length

    let maxDist = 0
    for (const island of catIslands) {
      const dx = island.x - centerX
      const dy = island.y - centerY
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist > maxDist) maxDist = dist
    }

    return {
      id: cat,
      category: cat,
      label: CATEGORY_LABELS[cat] || cat,
      color: CATEGORY_COLORS[cat] || "#888",
      centerX,
      centerY,
      radius: Math.max(200, maxDist + 120),
    }
  })
}

export function buildConnections(islands: Island[]): Connection[] {
  return []
}