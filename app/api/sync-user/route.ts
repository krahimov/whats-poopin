import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { adminDB } from '@/lib/instant-admin'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the full user object from Clerk
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const email = user.emailAddresses[0]?.emailAddress || ''
    console.log(`Syncing user: ${userId} (${email})`)

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
      
      return NextResponse.json({ 
        message: 'User and profile created successfully',
        user: {
          clerkId: userId,
          instantDbId: instantDbUserId,
          email: email,
          firstName: user.firstName,
          lastName: user.lastName,
        }
      })
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
      
      return NextResponse.json({ 
        message: 'Profile updated successfully',
        user: {
          clerkId: userId,
          instantDbId: instantDbUserId,
          email: email,
          firstName: user.firstName,
          lastName: user.lastName,
        }
      })
    }
  } catch (error) {
    console.error('User sync error:', error)
    if (error instanceof Error) {
      console.error('Full error details:', {
        message: error.message,
        stack: error.stack,
        // @ts-ignore
        status: error.status,
        // @ts-ignore
        body: error.body
      })
    }
    return NextResponse.json(
      { error: 'Failed to sync user', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 