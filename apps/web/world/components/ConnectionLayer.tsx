"use client"

import { Connection, Island } from "../types"

interface ConnectionLayerProps {
  connections: Connection[]
  islands: Island[]
}

export default function ConnectionLayer({ connections, islands }: ConnectionLayerProps) {
  const islandMap = new Map(islands.map(i => [i.id, i]))

  return (
    <>
      {connections.map(conn => {
        const from = islandMap.get(conn.fromIslandId)
        const to = islandMap.get(conn.toIslandId)
        if (!from || !to) return null

        return (
          <line
            key={conn.id}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="#94a3b8"
            strokeWidth={conn.strength * 2}
            opacity={conn.strength * 0.4}
            strokeLinecap="round"
          />
        )
      })}
    </>
  )
}