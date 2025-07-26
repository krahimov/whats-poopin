import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { analyzePoopImage } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze image. Please try again.' },
      { status: 500 }
    )
  }
} 