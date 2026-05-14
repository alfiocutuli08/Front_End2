export type User = {
  id: number
  name: string
  email: string
  bio?: string
  location?: string
  level?: string
  image_url?: string
  skills?: UserSkill[]
}

export type UserSkill = {
  id: number
  user_id: number
  skill_id: number
  category: "offer" | "search"
  level: string
  skill_name: string
}

export type UserCreate = {
  name: string
  email: string
  password: string
}

export type UserLogin = {
  email: string
  password: string
}

export type UserUpdate = {
  name?: string
  bio?: string
  location?: string
  level?: string
  image_url?: string
}

export type Skill = {
  id: number
  name: string
  category?: "offer" | "search"
}

export type UserProfile = User

export type Match = {
  id: number
  name: string
  email: string
  location?: string
  level?: string
  rating?: number
  image_url?: string
  offerte: string[]
  cercate: string[]
}

export type Stats = {
  utenti_attivi: number
  sessioni_completate: number
  skill_disponibili: number
  rating_medio: number
}

export type RequestStatus = "pending" | "accepted" | "declined" | "completed"

export type Request = {
  id: number
  from_user_id: number
  to_user_id: number
  status: RequestStatus
  created_at: string
  from_user_name?: string
  to_user_name?: string
}

export type Feedback = {
  id: number
  from_user_id: number
  to_user_id: number
  request_id: number
  rating: number
  comment: string | null
  created_at: string
  from_user_name?: string
}
