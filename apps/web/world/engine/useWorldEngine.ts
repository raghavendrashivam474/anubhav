"use client"

import { useState, useEffect, useCallback } from "react"
import { Island, Region, Connection } from "../types"
import {
  mapExperiencesToIslands,
  mapCategoriesToRegions,
  buildConnections,
} from "../mappers/experienceMapper"
import { getAnubhavs, getAnubhav, setAuthToken } from "@/services/api"

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

      const data = await getAnubhavs(1, 100)
      const experiences = data?.items || []

      const mappedIslands = mapExperiencesToIslands(experiences)
      const mappedRegions = mapCategoriesToRegions(mappedIslands)
      const mappedConnections = buildConnections(mappedIslands)

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
    } catch (e) {
      console.error(e)
    }
  }, [])

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