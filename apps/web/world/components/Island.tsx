"use client"

import { Island } from "../types"

const CATEGORY_TONES: Record<string, { land: string; hill: string; shore: string }> = {
  career:        { land: "#5d7a99", hill: "#3d5573", shore: "#8ba5c0" },
  relationships: { land: "#b8746b", hill: "#8a5049", shore: "#d4988e" },
  health:        { land: "#6b8f6b", hill: "#4a6a4a", shore: "#8fb08f" },
  money:         { land: "#a8956b", hill: "#7a6a48", shore: "#c4b58c" },
  mindset:       { land: "#8a7ba8", hill: "#5f537a", shore: "#a89cc0" },
  life:          { land: "#6b8fa8", hill: "#4a6a80", shore: "#8fadc0" },
}

interface IslandProps {
  island: Island
  isSelected: boolean
  isHovered: boolean
  onSelect: (island: Island) => void
  onHover: (id: string | null) => void
}

function getIslandPath(category: string, radius: number): string {
  const r = radius
  switch (category) {
    case "career":
      return `M ${-r},0 L ${-r * 0.7},${-r * 0.8} L 0,${-r} L ${r * 0.7},${-r * 0.8} L ${r},${r * 0.2} L ${r * 0.6},${r * 0.9} L ${-r * 0.5},${r} L ${-r * 0.9},${r * 0.4} Z`
    case "health":
      return `M ${-r},${r * 0.1} Q ${-r * 0.9},${-r} 0,${-r * 0.95} Q ${r * 0.95},${-r * 0.8} ${r},${r * 0.2} Q ${r * 0.7},${r} 0,${r * 0.95} Q ${-r * 0.9},${r * 0.7} ${-r},${r * 0.1} Z`
    case "relationships":
      return `M 0,${-r} Q ${r},${-r * 0.5} ${r * 0.95},0 Q ${r * 0.8},${r * 0.9} 0,${r} Q ${-r * 0.9},${r * 0.7} ${-r * 0.95},0 Q ${-r},${-r * 0.6} 0,${-r} Z`
    case "money":
      return `M ${-r * 0.9},${-r * 0.6} L ${r * 0.7},${-r * 0.9} L ${r},${-r * 0.1} L ${r * 0.8},${r * 0.8} L ${-r * 0.6},${r * 0.95} L ${-r},${r * 0.1} Z`
    case "mindset":
      return `M ${-r * 0.8},${-r * 0.5} Q ${-r * 0.3},${-r * 1.1} ${r * 0.4},${-r * 0.9} Q ${r * 1.1},${-r * 0.2} ${r * 0.9},${r * 0.5} Q ${r * 0.2},${r * 1.1} ${-r * 0.5},${r * 0.85} Q ${-r * 1.1},${r * 0.3} ${-r * 0.8},${-r * 0.5} Z`
    default:
      return `M ${-r * 0.9},${-r * 0.3} Q ${-r * 0.6},${-r} ${r * 0.2},${-r * 0.95} Q ${r},${-r * 0.4} ${r * 0.95},${r * 0.3} Q ${r * 0.5},${r} ${-r * 0.3},${r * 0.95} Q ${-r},${r * 0.4} ${-r * 0.9},${-r * 0.3} Z`
  }
}

export default function IslandComponent({
  island,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}: IslandProps) {
  const tones = CATEGORY_TONES[island.category] || CATEGORY_TONES.life
  const path = getIslandPath(island.category, island.radius)
  const active = isSelected || isHovered

  return (
    <g
      transform={`translate(${island.x}, ${island.y})`}
      onClick={() => onSelect(island)}
      onMouseEnter={() => onHover(island.id)}
      onMouseLeave={() => onHover(null)}
      style={{ cursor: "pointer" }}
    >
      {/* Deep water shadow beneath */}
      <ellipse
        cx={4}
        cy={island.radius * 0.9}
        rx={island.radius * 1.15}
        ry={island.radius * 0.28}
        fill="#000"
        opacity={0.4}
      />

      {/* Thin sand ring (only a rim, not a full layer) */}
      <path
        d={path}
        transform="scale(1.06)"
        fill="#9c8a6b"
        opacity={0.35}
      />

      {/* Main land — this is now dominant */}
      <path
        d={path}
        fill={tones.land}
        opacity={1}
      />

      {/* Inner hill for depth */}
      <path
        d={path}
        transform="scale(0.6) translate(0, -8)"
        fill={tones.hill}
        opacity={1}
      />

      {/* Northwest light highlight */}
      <ellipse
        cx={-island.radius * 0.2}
        cy={-island.radius * 0.4}
        rx={island.radius * 0.25}
        ry={island.radius * 0.18}
        fill="#fff"
        opacity={0.08}
      />

      {/* Selection ring */}
      {isSelected && (
        <path
          d={path}
          transform="scale(1.12)"
          fill="none"
          stroke="#fff"
          strokeWidth={1}
          opacity={0.5}
        />
      )}

      {/* Hover ring */}
      {isHovered && !isSelected && (
        <path
          d={path}
          transform="scale(1.1)"
          fill="none"
          stroke="#fff"
          strokeWidth={0.8}
          opacity={0.3}
        />
      )}

      {/* Wisdom lantern — brightest object */}
      {island.hasWisdom && (
        <g transform={`translate(${island.radius * 0.35}, ${-island.radius * 0.5})`}>
          <circle r={10} fill="#fbbf24" opacity={0.15} />
          <circle r={6} fill="#fbbf24" opacity={0.5} />
          <circle r={2.5} fill="#fef3c7" />
        </g>
      )}

      {/* Label */}
      <text
        y={island.radius + 26}
        textAnchor="middle"
        fontSize={10}
        fill="#94a3b8"
        opacity={active ? 0.9 : 0.5}
        style={{ pointerEvents: "none", userSelect: "none", letterSpacing: "0.02em" }}
      >
        {island.label}
      </text>
    </g>
  )
}