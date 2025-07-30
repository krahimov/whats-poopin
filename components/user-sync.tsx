'use client'

import { useEffect, useRef, useState } from 'react'

// Get the correct API base URL
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_CAPACITOR_BUILD === 'true') {
    return 'https://whats-poopin-git-dev-karim-rahimovs-projects.vercel.app'
  }
  return ''
}

// Mobile-safe hook
const useMobileUser = () => {
  const isMobileBuild = process.env.NEXT_PUBLIC_CAPACITOR_BUILD === 'true'
  
  if (isMobileBuild) {
    return { isSignedIn: false, user: null }
  }
  
  try {
    const { useUser } = require('@clerk/nextjs')
    return useUser()
  } catch {
    return { isSignedIn: false, user: null }
  }
}

export default function UserSync() {
  const { isSignedIn, user } = useMobileUser()
  const syncedRef = useRef(false)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isSignedIn && user && !syncedRef.current && !syncing && !error) {
      setSyncing(true)
      
      // Sync user with InstantDB
      const syncUser = async () => {
        try {
          const response = await fetch(`${getApiBaseUrl()}/api/sync-user`, {
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