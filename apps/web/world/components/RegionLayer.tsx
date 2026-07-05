"use client"

import { Region } from "../types"

interface RegionLayerProps {
  regions: Region[]
}

export default function RegionLayer({ regions }: RegionLayerProps) {
  return (
    <>
      {regions.map(region => (
        <g key={region.id}>
          {/* Region background circle */}
          <circle
            cx={region.centerX}
            cy={region.centerY}
            r={region.radius}
            fill={region.color}
            opacity={0.06}
            stroke={region.color}
            strokeWidth={1}
            strokeOpacity={0.15}
          />
          {/* Region label */}
          <text
            x={region.centerX}
            y={region.centerY - region.radius + 24}
            textAnchor="middle"
            fontSize={13}
            fill={region.color}
            opacity={0.5}
            fontWeight="500"
            letterSpacing="0.05em"
            style={{ userSelect: "none", pointerEvents: "none" }}
          >
            {region.label.toUpperCase()}
          </text>
        </g>
      ))}
    </>
  )
}