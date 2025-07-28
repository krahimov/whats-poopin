import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { analyzePoopImage } from '@/lib/openai'
import { adminDB } from '@/lib/instant-admin'
import { syncCurrentUser } from '@/lib/user-sync'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Sync user to ensure they exist in InstantDB (non-blocking)
    await syncCurrentUser(userId).catch(() => {}) // Don't fail if sync fails

    const body = await request.json()
    const { imageUrl, animalType } = body

    if (!imageUrl || !animalType) {
      return NextResponse.json(
        { error: 'Missing required fields: imageUrl and animalType' },
        { status: 400 }
      )
    }

    if (!['human', 'dog'].includes(animalType)) {
      return NextResponse.json(
        { error: 'Invalid animalType. Must be "human" or "dog"' },
        { status: 400 }
      )
    }

    // Analyze the image
    const analysis = await analyzePoopImage(imageUrl, animalType)

    // Save the analysis to InstantDB using admin client
    try {
      await adminDB.transact([
        adminDB.tx.analyses[randomUUID()].update({
          userId,
          imageUrl,
          rating: analysis.rating,
          summary: analysis.summary,
          recommendations: analysis.recommendations,
          animalType,
          createdAt: Date.now(),
          isPublic: false,
        })
      ])
      console.log('Analysis saved to InstantDB successfully')
    } catch (error) {
      console.error('Failed to save analysis to InstantDB:', error)
      // Don't fail the request if saving to DB fails
    }

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Analysis error:', error)
    
    // Provide more specific error messages
    let errorMessage = 'Failed to analyze image. Please try again.'
    let statusCode = 500
    
    if (error instanceof Error) {
      if (error.message.includes('Unable to analyze this image')) {
        errorMessage = 'Unable to analyze this image. Please ensure the image is clear and contains a visible sample.'
        statusCode = 400
      } else if (error.message.includes('Service configuration error')) {
        errorMessage = 'Service temporarily unavailable. Please try again later.'
        statusCode = 503
      } else if (error.message.includes('Analysis service error')) {
        errorMessage = 'Analysis service error. Please try again in a moment.'
        statusCode = 500
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    )
  }
} 