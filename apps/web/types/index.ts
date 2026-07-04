export interface User {
  id: string
  email: string
  name: string | null
  created_at: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface Tag {
  id: string
  name: string
}

export interface Anubhav {
  id: string
  user_id: string
  what_happened: string
  lesson: string | null
  advice: string | null
  summary: string | null
  category: string
  source: string
  tags: Tag[]
  created_at: string
  updated_at: string
}

export interface AnubhavList {
  items: Anubhav[]
  total: number
  page: number
  page_size: number
}

export interface Reminder {
  id: string
  user_id: string
  anubhav_id: string
  trigger_at: string
  status: string
  created_at: string
}

export interface ReminderList {
  items: Reminder[]
  total: number
  page: number
  page_size: number
}

export interface SearchResult {
  id: string
  what_happened: string
  lesson: string | null
  summary: string | null
  category: string
  tags: Tag[]
  similarity_score?: number
}

export type Category = 'career' | 'relationships' | 'health' | 'money' | 'mindset' | 'life'
export type Source = 'myself' | 'friend' | 'book' | 'podcast' | 'observation'