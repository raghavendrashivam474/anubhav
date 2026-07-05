"use client"

import { useEffect, useRef } from "react"
import { Island, Region, Connection, Camera } from "../types"
import IslandComponent from "../components/Island"
import RegionLayer from "../components/RegionLayer"
import ConnectionLayer from "../components/ConnectionLayer"
import OceanBackground from "../components/OceanBackground"

interface WorldRendererProps {
  islands: Island[]
  regions: Region[]
  connections: Connection[]
  camera: Camera
  selectedIslandId: string | null
  hoveredIslandId: string | null
  onSelectIsland: (island: Island) => void
  onHoverIsland: (id: string | null) => void
  onMouseDown: (e: React.MouseEvent) => void
  onMouseMove: (e: React.MouseEvent) => void
  onMouseUp: () => void
  onWheel: (e: WheelEvent) => void
}

export default function WorldRenderer({
  islands,
  regions,
  connections,
  camera,
  selectedIslandId,
  hoveredIslandId,
  onSelectIsland,
  onHoverIsland,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onWheel,
}: WorldRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [onWheel])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      style={{ cursor: "grab", userSelect: "none" }}
    >
      <OceanBackground />

      <svg
        className="absolute inset-0 w-full h-full"
        style={{ overflow: "visible" }}
      >
        <g
          transform={`translate(${window.innerWidth / 2}, ${window.innerHeight / 2}) scale(${camera.zoom}) translate(${camera.x}, ${camera.y})`}
        >
          <RegionLayer regions={regions} />
          <ConnectionLayer connections={connections} islands={islands} />
          {islands.map(island => (
            <IslandComponent
              key={island.id}
              island={island}
              isSelected={selectedIslandId === island.id}
              isHovered={hoveredIslandId === island.id}
              onSelect={onSelectIsland}
              onHover={onHoverIsland}
            />
          ))}
        </g>
      </svg>
    </div>
  )
}