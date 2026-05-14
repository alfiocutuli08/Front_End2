export type User = {
  id: number
  name: string
  email: string
}

export type Token = {
  access_token: string
  token_type: string
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

export type Skill = {
  id: number
  name: string
  category: "offer" | "search"
}

export type UserProfile = User & {
  bio?: string
  location?: string
  level?: string
  rating?: number
  skills?: Skill[]
  image_url?: string
}

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

export type RequestStatus = "pending" | "accepted" | "declined"

export type Request = {
  id: number
  from_user_id: number
  to_user_id: number
  status: RequestStatus
  created_at: string
}
