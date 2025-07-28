import { NextRequest, NextResponse } from 'next/server'
import { adminDB } from '@/lib/instant-admin'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
  let testUserId: string = 'unknown'
  
  try {
    const { method = 'create', idType = 'uuid' } = await request.json()
    
    // Test different ID formats
    if (idType === 'uuid') {
      testUserId = randomUUID()
    } else if (idType === 'clerk') {
      testUserId = `user_${randomUUID().replace(/-/g, '').substring(0, 24)}`
    } else {
      testUserId = 'test-user-123'
    }
    
    const testEmail = 'test@example.com'
    
    console.log(`Testing $users operations with method: ${method}, idType: ${idType}, id: ${testUserId}`)
    
    if (method === 'create') {
      console.log(`Attempting to create user in $users: ${testUserId}`)
      
      // Try to create a user in $users
      const result = await adminDB.transact([
        adminDB.tx.$users[testUserId].update({
          email: testEmail,
        })
      ])
      
      console.log('$users create result:', result)
      
      return NextResponse.json({
        success: true,
        message: 'User created in $users successfully',
        userId: testUserId,
        result
      })
    } else if (method === 'query') {
      console.log('Querying $users entity')
      
      const users = await adminDB.query({
        $users: {}
      })
      
      console.log('$users query result:', users)
      
      return NextResponse.json({
        success: true,
        message: 'Queried $users successfully',
        users: users.$users || []
      })
    } else if (method === 'delete') {
      console.log(`Attempting to delete test user: ${testUserId}`)
      
      const result = await adminDB.transact([
        adminDB.tx.$users[testUserId].delete()
      ])
      
      console.log('$users delete result:', result)
      
      return NextResponse.json({
        success: true,
        message: 'Test user deleted successfully',
        result
      })
    }
    
    return NextResponse.json({ error: 'Invalid method' }, { status: 400 })
    
  } catch (error) {
    console.error('$users test failed:', error)
    
    if (error instanceof Error) {
      console.error('Detailed error:', {
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
      details: error?.body || null,
      idUsed: testUserId
    }, { status: 500 })
  }
} 