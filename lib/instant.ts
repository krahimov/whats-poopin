import { init } from '@instantdb/react'

// Initialize InstantDB
export const db = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
})

// Function to ensure schema is initialized
export const initializeSchema = async () => {
  try {
    // This will create the schema if it doesn't exist
    await db.transact([
      // Create a dummy record to ensure the table exists
      db.tx.analyses['schema-init'].update({
        userId: 'schema-init',
        imageUrl: '',
        rating: 0,
        summary: '',
        recommendations: [],
        animalType: 'human',
        createdAt: Date.now(),
        isPublic: false,
      })
    ])
    console.log('Schema initialized successfully')
  } catch (error) {
    console.error('Schema initialization error:', error)
  }
}

// Define the schema for InstantDB
export const schema = {
  analyses: {
    userId: { type: 'string' },
    imageUrl: { type: 'string' },
    rating: { type: 'number' },
    summary: { type: 'string' },
    recommendations: { type: 'array' },
    animalType: { type: 'string' },
    createdAt: { type: 'number' },
    isPublic: { type: 'boolean' },
  },
  users: {
    email: { type: 'string' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    avatarUrl: { type: 'string' },
    createdAt: { type: 'number' },
  },
}

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