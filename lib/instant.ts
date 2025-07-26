import { init } from '@instantdb/react'

// Initialize InstantDB
export const db = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
})

export type Analysis = {
  id: string
  userId: string
  imageUrl: string
  rating: number
  summary: string
  recommendations: string[]
  animalType: 'human' | 'dog'
  createdAt: number
  isPublic: boolean
}

export type User = {
  id: string
  email: string
  firstName: string
  lastName: string
  avatarUrl: string
  createdAt: number
} 