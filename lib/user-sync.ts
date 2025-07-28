import { currentUser } from '@clerk/nextjs/server'
import { adminDB } from './instant-admin'
import { randomUUID } from 'crypto'

export async function syncCurrentUser(userId: string) {
  try {
    // Get the full user object from Clerk
    const user = await currentUser()
    if (!user) {
      console.warn('User not found in Clerk for ID:', userId)
      return false
    }

    const email = user.emailAddresses[0]?.emailAddress || ''

    // Check if profile exists (this will tell us if user has been synced before)
    const existingProfiles = await adminDB.query({
      profiles: {
        $: {
          where: { userId: userId }
        }
      }
    })

    let instantDbUserId: string

    if (!existingProfiles.profiles || existingProfiles.profiles.length === 0) {
      // New user - create both $users entry and profile
      instantDbUserId = randomUUID() // Generate UUID for $users
      
      console.log(`Creating new user - Clerk ID: ${userId}, InstantDB UUID: ${instantDbUserId}`)

      // First create the user in $users with UUID
      await adminDB.transact([
        adminDB.tx.$users[instantDbUserId].update({
          email: email,
        })
      ])
      console.log(`Created user in $users: ${instantDbUserId} (${email})`)

      // Then create profile with both IDs
      const profileId = randomUUID()
      await adminDB.transact([
        adminDB.tx.profiles[profileId].update({
          userId: userId, // Clerk user ID
          instantDbUserId: instantDbUserId, // InstantDB UUID
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          imageUrl: user.imageUrl || '',
          createdAt: Date.now(),
        })
      ])
      console.log(`Created new profile for user: ${userId} (${email})`)
    } else {
      // Existing user - update profile only
      const profile = existingProfiles.profiles[0]
      instantDbUserId = profile.instantDbUserId || randomUUID()
      
      console.log(`Updating existing user - Clerk ID: ${userId}, InstantDB UUID: ${instantDbUserId}`)

      // If no instantDbUserId exists, create $users entry
      if (!profile.instantDbUserId) {
        await adminDB.transact([
          adminDB.tx.$users[instantDbUserId].update({
            email: email,
          })
        ])
        console.log(`Created missing $users entry: ${instantDbUserId}`)
      }

      // Update profile
      await adminDB.transact([
        adminDB.tx.profiles[profile.id].update({
          instantDbUserId: instantDbUserId, // Ensure this is set
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          imageUrl: user.imageUrl || '',
        })
      ])
      console.log(`Updated existing profile for user: ${userId} (${email})`)
    }

    return true
  } catch (error) {
    console.error('User sync error:', error)
    return false
  }
} 