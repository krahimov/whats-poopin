import { NextRequest, NextResponse } from 'next/server'
import { adminDB } from '@/lib/instant-admin'

export async function GET(request: NextRequest) {
  try {
    console.log('Testing InstantDB admin connection...')
    
    // Test different entities
    const analysesResult = await adminDB.query({
      analyses: {
        $: {
          limit: 1
        }
      }
    })

    const usersResult = await adminDB.query({
      $users: {
        $: {
          limit: 5
        }
      }
    })

    const profilesResult = await adminDB.query({
      profiles: {
        $: {
          limit: 5
        }
      }
    })
    
    console.log('DB connection successful')
    console.log('Users result:', usersResult)
    console.log('Profiles result:', profilesResult)
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        analysesCount: analysesResult.analyses?.length || 0,
        usersCount: usersResult.$users?.length || 0,
        profilesCount: profilesResult.profiles?.length || 0,
        users: usersResult.$users || [],
        profiles: profilesResult.profiles || []
      }
    })
  } catch (error) {
    console.error('DB connection test failed:', error)
    
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        // @ts-ignore
        status: error.status,
        // @ts-ignore
        body: error.body
      })
    }
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      // @ts-ignore
      details: error?.body || null
    }, { status: 500 })
  }
} 