"use client"

import { createContext, useContext, useEffect, useState, useCallback, useRef, ReactNode } from "react"
import { User } from "@/types"
import { setAuthToken } from "@/services/api"

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (token: string, user: User) => void
  logout: () => void
  invalidateSession: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

// Global callback for API interceptor to trigger session invalidation
let globalInvalidateSession: (() => void) | null = null

export function getGlobalInvalidateSession() {
  return globalInvalidateSession
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const isInvalidating = useRef(false)

  // Restore session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("anubhav_token")
    const storedUser = localStorage.getItem("anubhav_user")
    if (storedToken && storedUser) {
      try {
        const parsed = JSON.parse(storedUser)
        setToken(storedToken)
        setUser(parsed)
        setAuthToken(storedToken)
      } catch {
        // Corrupt data — clear it
        localStorage.removeItem("anubhav_token")
        localStorage.removeItem("anubhav_user")
      }
    }
    setIsLoading(false)
  }, [])

  // Canonical session operations
  const setSession = useCallback((newToken: string, newUser: User) => {
    localStorage.setItem("anubhav_token", newToken)
    localStorage.setItem("anubhav_user", JSON.stringify(newUser))
    setAuthToken(newToken)
    setToken(newToken)
    setUser(newUser)
    isInvalidating.current = false
  }, [])

  const invalidateSession = useCallback(() => {
    // Prevent duplicate invalidation from concurrent 401s
    if (isInvalidating.current) return
    isInvalidating.current = true

    localStorage.removeItem("anubhav_token")
    localStorage.removeItem("anubhav_user")
    setAuthToken(null)
    setToken(null)
    setUser(null)
  }, [])

  const loginFn = useCallback((newToken: string, newUser: User) => {
    setSession(newToken, newUser)
  }, [setSession])

  const logoutFn = useCallback(() => {
    invalidateSession()
  }, [invalidateSession])

  // Register global invalidation callback for API interceptor
  useEffect(() => {
    globalInvalidateSession = invalidateSession
    return () => { globalInvalidateSession = null }
  }, [invalidateSession])

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      login: loginFn,
      logout: logoutFn,
      invalidateSession,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}