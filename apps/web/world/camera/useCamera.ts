"use client"

import { useState, useRef, useCallback } from "react"
import { Camera } from "../types"

const MIN_ZOOM = 0.2
const MAX_ZOOM = 2.5
const DEFAULT_CAMERA: Camera = { x: 0, y: 0, zoom: 0.6 }

export function useCamera() {
  const [camera, setCamera] = useState<Camera>(DEFAULT_CAMERA)
  const isDragging = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true
    lastPos.current = { x: e.clientX, y: e.clientY }
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return
    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    lastPos.current = { x: e.clientX, y: e.clientY }
    setCamera(prev => ({
      ...prev,
      x: prev.x + dx / prev.zoom,
      y: prev.y + dy / prev.zoom,
    }))
  }, [])

  const onMouseUp = useCallback(() => {
    isDragging.current = false
  }, [])

  const onWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setCamera(prev => ({
      ...prev,
      zoom: Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev.zoom * delta)),
    }))
  }, [])

  const zoomIn = useCallback(() => {
    setCamera(prev => ({
      ...prev,
      zoom: Math.min(MAX_ZOOM, prev.zoom * 1.3),
    }))
  }, [])

  const zoomOut = useCallback(() => {
    setCamera(prev => ({
      ...prev,
      zoom: Math.max(MIN_ZOOM, prev.zoom * 0.75),
    }))
  }, [])

  const focusOn = useCallback((x: number, y: number, zoom = 1.2) => {
    setCamera({ x: -x, y: -y, zoom })
  }, [])

  const resetCamera = useCallback(() => {
    setCamera(DEFAULT_CAMERA)
  }, [])

  return {
    camera,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onWheel,
    focusOn,
    resetCamera,
    zoomIn,
    zoomOut,
  }
}