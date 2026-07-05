import { Island, Region, Connection, Camera } from "./index"

export interface RendererProps {
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

export interface WorldRenderer {
  (props: RendererProps): JSX.Element
}