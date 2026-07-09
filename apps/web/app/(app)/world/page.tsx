"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useWorldEngine } from "@/world/engine/useWorldEngine"
import { useCamera } from "@/world/camera/useCamera"
import WorldRenderer from "@/world/renderer/WorldRenderer"
import ExperienceDock from "@/world/components/ExperienceDock"
import Link from "next/link"
import { Plus, RotateCcw, ZoomIn, ZoomOut } from "lucide-react"

export default function WorldPage() {
  const searchParams = useSearchParams()
  const focusId = searchParams.get("focus")

  const {
    islands,
    regions,
    connections,
    selectedIsland,
    hoveredIslandId,
    loading,
    error,
    selectIsland,
    deselectIsland,
    setHoveredIslandId,
    refreshIsland,
  } = useWorldEngine()

  const {
    camera,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onWheel,
    focusOn,
    resetCamera,
    zoomIn,
    zoomOut,
  } = useCamera()

  const handleSelectIsland = (island: any) => {
    selectIsland(island)
    focusOn(island.x, island.y, 1.2)
  }

  useEffect(() => {
    if (!focusId || islands.length === 0) return
    const target = islands.find(i => i.id === focusId)
    if (target) {
      selectIsland(target)
      focusOn(target.x, target.y, 1.4)
    }
  }, [focusId, islands, selectIsland, focusOn])

  if (loading) {
    return (
      <div className="w-screen h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400 text-sm">Preparing your wisdom world...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-screen h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <WorldRenderer
        islands={islands}
        regions={regions}
        connections={connections}
        camera={camera}
        selectedIslandId={selectedIsland?.id || null}
        hoveredIslandId={hoveredIslandId}
        onSelectIsland={handleSelectIsland}
        onHoverIsland={setHoveredIslandId}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onWheel={onWheel}
      />

      {/* Minimal top bar — right side only, world remains dominant */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
        <button
          onClick={zoomOut}
          className="p-2 bg-slate-900/70 backdrop-blur hover:bg-slate-800 text-slate-300 rounded-lg transition-colors"
          title="Zoom out"
        >
          <ZoomOut size={14} />
        </button>

        <button
          onClick={zoomIn}
          className="p-2 bg-slate-900/70 backdrop-blur hover:bg-slate-800 text-slate-300 rounded-lg transition-colors"
          title="Zoom in"
        >
          <ZoomIn size={14} />
        </button>

        <button
          onClick={resetCamera}
          className="p-2 bg-slate-900/70 backdrop-blur hover:bg-slate-800 text-slate-300 rounded-lg transition-colors"
          title="Reset view"
        >
          <RotateCcw size={14} />
        </button>

        <Link
          href="/experiences/new"
          className="px-3 py-2 text-xs bg-white/90 backdrop-blur hover:bg-white text-stone-800 rounded-lg transition-colors flex items-center gap-1.5 font-medium"
        >
          <Plus size={12} />
          New Experience
        </Link>
      </div>

      {/* Region legend — subtle */}
      <div className="absolute bottom-6 left-6 z-30 space-y-1 opacity-60 hover:opacity-100 transition-opacity">
        {regions.map(region => (
          <div key={region.id} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: region.color }} />
            <span className="text-xs text-slate-400">{region.label}</span>
          </div>
        ))}
      </div>

      {/* Experience count — subtle */}
      <div className="absolute bottom-6 right-6 z-30 opacity-40 hover:opacity-100 transition-opacity">
        <p className="text-xs text-slate-400">{islands.length} experiences</p>
      </div>

      {islands.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="text-center space-y-4">
            <p className="text-slate-500 text-lg font-light">Your ocean is empty.</p>
            <p className="text-slate-600 text-sm">Create your first experience to begin.</p>
          </div>
        </div>
      )}

      <ExperienceDock
        island={selectedIsland}
        onClose={deselectIsland}
        onWisdomExtracted={refreshIsland}
      />
    </div>
  )
}