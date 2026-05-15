import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const FALLBACK_AVATAR = "https://cdn.phototourl.com/free/2026-05-12-bac6185b-c4fb-44db-bc6e-99673f2d71cd.jpg"

export function getAvatarUrl(id?: number, image_url?: string | null): string {
  if (image_url) return image_url
  if (id) return `https://i.pravatar.cc/300?img=${(id % 70) + 1}`
  return FALLBACK_AVATAR
}