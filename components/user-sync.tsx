'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useRef, useState } from 'react'

export default function UserSync() {
  const { isSignedIn, user } = useUser()
  const syncedRef = useRef(false)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isSignedIn && user && !syncedRef.current && !syncing && !error) {
      setSyncing(true)
      
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
            setError(null)
          } else {
            const errorText = await response.text()
            console.warn('Failed to sync user:', response.status, errorText)
            setError(`Sync failed: ${response.status}`)
          }
        } catch (error) {
          console.warn('User sync error:', error)
          setError('Network error during sync')
        } finally {
          setSyncing(false)
        }
      }

      syncUser()
    }
  }, [isSignedIn, user, syncing, error])

  // This component doesn't render anything visible
  return null
} 