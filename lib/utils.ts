import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function generatePoopEmoji(rating: number): string {
  if (rating >= 90) return "💎"  // Diamond poop
  if (rating >= 80) return "✨"  // Sparkly
  if (rating >= 70) return "😊"  // Happy
  if (rating >= 60) return "😐"  // Neutral
  if (rating >= 50) return "😕"  // Slightly unhappy
  if (rating >= 40) return "😰"  // Worried
  if (rating >= 30) return "😨"  // Fearful
  return "💀"  // Skull for very poor
}

export function getHealthCategory(rating: number): { category: string; color: string } {
  if (rating >= 80) return { category: "Excellent", color: "text-green-600" }
  if (rating >= 70) return { category: "Good", color: "text-blue-600" }
  if (rating >= 60) return { category: "Fair", color: "text-yellow-600" }
  if (rating >= 40) return { category: "Poor", color: "text-orange-600" }
  return { category: "Critical", color: "text-red-600" }
} 