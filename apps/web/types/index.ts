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

export interface ReflectionItem {
  id: string
  title: string
  category: string
  reflection_type: "reminder" | "forgotten" | "relationship" | "random"
  reason: string
  lesson: string | null
  summary: string | null
  similarity_score: number | null
  relationship_count: number | null
  due_date: string | null
  created_at: string | null
}

export interface ReflectionResponse {
  date: string
  total: number
  items: ReflectionItem[]
}

export interface RelatedItem {
  id: string
  similarity_score: number
  what_happened: string
  lesson: string | null
  category: string
  created_at: string
}

export interface RelatedResponse {
  items: RelatedItem[]
  total: number
}

export type Category = 'career' | 'relationships' | 'health' | 'money' | 'mindset' | 'life'
export type Source = 'myself' | 'friend' | 'book' | 'podcast' | 'observation'