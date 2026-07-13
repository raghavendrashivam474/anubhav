"use client"

import { useState, useEffect, useCallback } from "react"
import { Island, Region, Connection } from "../types"
import {
  mapExperiencesToIslands,
  mapCategoriesToRegions,
} from "../mappers/experienceMapper"
import { getAnubhavs, getAnubhav, setAuthToken, api } from "@/services/api"

export function useWorldEngine() {
  const [islands, setIslands] = useState<Island[]>([])
  const [regions, setRegions] = useState<Region[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [selectedIsland, setSelectedIsland] = useState<Island | null>(null)
  const [hoveredIslandId, setHoveredIslandId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadWorld = useCallback(async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("anubhav_token")
      if (token) setAuthToken(token)

      const [experiencesData, connectionsData] = await Promise.all([
        getAnubhavs(1, 100),
        api.get("/anubhavs/connections").then(r => r.data).catch(() => ({ connections: [] })),
      ])

      const experiences = experiencesData?.items || []
      const rawConnections = connectionsData?.connections || []

      // Pass connections to mapper for force-directed layout
      const mappedIslands = mapExperiencesToIslands(experiences, rawConnections)
      const mappedRegions = mapCategoriesToRegions(mappedIslands)

      const mappedConnections: Connection[] = rawConnections.map((c: any) => ({
        id: `${c.source_id}-${c.target_id}`,
        fromIslandId: c.source_id,
        toIslandId: c.target_id,
        strength: c.similarity_score,
      }))

      setIslands(mappedIslands)
      setRegions(mappedRegions)
      setConnections(mappedConnections)
    } catch (e) {
      console.error(e)
      setError("Failed to load world")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadWorld()
  }, [loadWorld])

  const selectIsland = useCallback((island: Island) => {
    setSelectedIsland(island)
  }, [])

  const deselectIsland = useCallback(() => {
    setSelectedIsland(null)
  }, [])

  const refreshIsland = useCallback(async (id: string) => {
    try {
      const updated = await getAnubhav(id)
      setIslands(prev =>
        prev.map(island => {
          if (island.id !== id) return island
          return {
            ...island,
            lesson: updated.lesson,
            hasWisdom: !!(updated.lesson && updated.summary),
            raw: updated,
          }
        })
      )
      setSelectedIsland(prev => {
        if (!prev || prev.id !== id) return prev
        return {
          ...prev,
          lesson: updated.lesson,
          hasWisdom: !!(updated.lesson && updated.summary),
          raw: updated,
        }
      })
      await loadWorld()
    } catch (e) {
      console.error(e)
    }
  }, [loadWorld])

  return {
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
    loadWorld,
  }
}