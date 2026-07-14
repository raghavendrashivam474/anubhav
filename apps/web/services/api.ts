import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
})

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common["Authorization"]
  }
}

// --- Global 401 Interceptor ---
let isHandling401 = false

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !isHandling401) {
      isHandling401 = true
      try {
        // Dynamic import to avoid circular dependency
        const { getGlobalInvalidateSession } = await import("@/hooks/useAuth")
        const invalidate = getGlobalInvalidateSession()
        if (invalidate) invalidate()
        if (typeof window !== "undefined") {
          window.location.href = "/sign-in"
        }
      } finally {
        setTimeout(() => { isHandling401 = false }, 2000)
      }
    }
    return Promise.reject(error)
  }
)

// --- Health Check ---
export const checkHealth = async (): Promise<boolean> => {
  try {
    const res = await axios.get(`${API_URL}/health`, { timeout: 5000 })
    return res.status === 200
  } catch {
    return false
  }
}

// --- Auth ---
export const register = (email: string, password: string, name?: string) =>
  api.post("/auth/register", { email, password, name }).then(r => r.data)

export const login = (email: string, password: string) =>
  api.post("/auth/login", { email, password }).then(r => r.data)

export const getMe = () =>
  api.get("/auth/me").then(r => r.data)

// --- Anubhavs ---
export const getAnubhavs = (page = 1, pageSize = 20, category?: string) => {
  const params: Record<string, any> = { page, page_size: pageSize }
  if (category) params.category = category
  return api.get("/anubhavs", { params }).then(r => r.data)
}

export const getAnubhav = (id: string) =>
  api.get(`/anubhavs/${id}`).then(r => r.data)

export const createAnubhav = (payload: {
  what_happened: string
  category: string
  source: string
}) => api.post("/anubhavs", payload).then(r => r.data)

export const updateAnubhav = (id: string, payload: Partial<{
  what_happened: string
  category: string
  source: string
}>) => api.patch(`/anubhavs/${id}`, payload).then(r => r.data)

export const deleteAnubhav = (id: string) =>
  api.delete(`/anubhavs/${id}`)

export const extractWisdom = (id: string) =>
  api.post(`/anubhavs/${id}/extract`).then(r => r.data)

// --- Search ---
export const keywordSearch = (query: string, page = 1, pageSize = 20, category?: string) => {
  const params: Record<string, any> = { q: query, page, page_size: pageSize }
  if (category) params.category = category
  return api.get("/anubhavs/search", { params }).then(r => r.data)
}

export const semanticSearch = (query: string, page = 1, pageSize = 20, category?: string) => {
  const params: Record<string, any> = { q: query, page, page_size: pageSize }
  if (category) params.category = category
  return api.get("/anubhavs/semantic-search", { params }).then(r => r.data)
}

// --- Reminders ---
export const getReminders = (page = 1, pageSize = 20) =>
  api.get("/reminders", { params: { page, page_size: pageSize } }).then(r => r.data)

export const createReminder = (payload: { anubhav_id: string; trigger_at: string }) =>
  api.post("/reminders", payload).then(r => r.data)

export const deleteReminder = (id: string) =>
  api.delete(`/reminders/${id}`)

// --- Reflections ---
export const getTodaysReflections = (limit = 5) =>
  api.get("/reflections/today", { params: { limit } }).then(r => r.data)

// --- Relationships ---
export const getRelatedAnubhavs = (id: string, limit = 5) =>
  api.get(`/anubhavs/${id}/related`, { params: { limit } }).then(r => r.data)

export const getAllConnections = () =>
  api.get("/anubhavs/connections").then(r => r.data)