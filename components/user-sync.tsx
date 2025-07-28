'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useRef } from 'react'

export default function UserSync() {
  const { isSignedIn, user } = useUser()
  const syncedRef = useRef(false)

  useEffect(() => {
    if (isSignedIn && user && !syncedRef.current) {
      // Sync user with InstantDB
      const syncUser = async () => {
        try {
          const response = await fetch('/api/sync-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          })

          if (response.ok) {
            const data = await response.json()
            console.log('User synced successfully:', data.message)
            syncedRef.current = true
          } else {
            console.warn('Failed to sync user:', response.statusText)
          }
        } catch (error) {
          console.warn('User sync failed:', error)
        }
      }

      syncUser()
    }
  }, [isSignedIn, user])

  // This component doesn't render anything
  return null
} 