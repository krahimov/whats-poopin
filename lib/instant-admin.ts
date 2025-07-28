import { init } from '@instantdb/admin'

// Initialize InstantDB Admin client for server-side usage
export const adminDB = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
  adminToken: process.env.INSTANT_ADMIN_TOKEN!,
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