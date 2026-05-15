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
  type: "offered" | "wanted"
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
  description?: string
}

export type UserProfile = User

export type Match = {
  id: number
  name: string
  email?: string
  location?: string
  level?: string
  rating?: number
  image_url?: string
  offerte: string[]
  cercate: string[]
  is_match?: boolean
}

export type Stats = {
  total_users: number
  total_skills: number
  total_matches: number
}

export type RequestStatus = "pending" | "accepted" | "rejected" | "completed" | "cancelled"

export type Request = {
  id: number
  sender_id: number
  receiver_id: number
  sender_name: string
  receiver_name: string
  skill_id: number
  skill_name: string
  status: RequestStatus
  message?: string
  mode?: string
  sender_confirmed: boolean
  receiver_confirmed: boolean
  created_at: string
  updated_at?: string
}

export type Feedback = {
  id: number
  session_request_id: number
  reviewer_id: number
  reviewer_name: string
  rating: number
  comment: string | null
  created_at: string
}

export type TokenData = {
  access_token: string
  token_type: string
  user_id: number
  name: string
}
