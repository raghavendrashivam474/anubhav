// World types — bridge between backend data and visual world

export interface Island {
  id: string
  x: number
  y: number
  radius: number
  category: string
  label: string
  lesson: string | null
  hasReminder: boolean
  hasWisdom: boolean
  createdAt: string
  raw: any // original Anubhav object
}

export interface Region {
  id: string
  category: string
  label: string
  color: string
  centerX: number
  centerY: number
  radius: number
}

export interface Connection {
  id: string
  fromIslandId: string
  toIslandId: string
  strength: number // 0-1
}

export interface Camera {
  x: number
  y: number
  zoom: number
}

export interface WorldState {
  islands: Island[]
  regions: Region[]
  connections: Connection[]
  camera: Camera
  selectedIslandId: string | null
  hoveredIslandId: string | null
}

export const CATEGORY_COLORS: Record<string, string> = {
  career: "#3b5998",
  relationships: "#e07b54",
  health: "#4a9e6b",
  money: "#c8a83a",
  mindset: "#7b68c8",
  life: "#4a8fa8",
}

export const CATEGORY_LABELS: Record<string, string> = {
  career: "Career Sea",
  relationships: "Relationships Bay",
  health: "Health Cove",
  money: "Wealth Waters",
  mindset: "Mindset Ocean",
  life: "Life Expanse",
}