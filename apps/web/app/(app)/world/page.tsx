"use client"

import { useWorldEngine } from "@/world/engine/useWorldEngine"
import { useCamera } from "@/world/camera/useCamera"
import WorldRenderer from "@/world/renderer/WorldRenderer"
import ExperienceDock from "@/world/components/ExperienceDock"
import Link from "next/link"
import { Plus, RotateCcw, Compass, ZoomIn, ZoomOut } from "lucide-react"

export default function WorldPage() {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400 text-sm">Preparing your wisdom world...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
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

      <div className="absolute top-0 left-0 right-0 px-6 py-4 flex items-center justify-between z-40">
        <div>
          <h1 className="text-white text-lg font-semibold">Anubhav</h1>
          <p className="text-slate-500 text-xs">{islands.length} experiences</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/wisdom-space"
            className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Compass size={12} />
            Wisdom Space
          </Link>

          <button
            onClick={zoomOut}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            title="Zoom out"
          >
            <ZoomOut size={14} />
          </button>

          <button
            onClick={zoomIn}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            title="Zoom in"
          >
            <ZoomIn size={14} />
          </button>

          <button
            onClick={resetCamera}
            className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <RotateCcw size={12} />
            Reset
          </button>

          <Link
            href="/experiences/new"
            className="px-3 py-1.5 text-xs bg-white hover:bg-stone-100 text-stone-800 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Plus size={12} />
            New
          </Link>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 z-40 space-y-1">
        {regions.map(region => (
          <div key={region.id} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: region.color }} />
            <span className="text-xs text-slate-500">{region.label}</span>
          </div>
        ))}
      </div>

      {islands.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
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