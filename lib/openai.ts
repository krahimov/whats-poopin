import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export interface PoopAnalysis {
  rating: number
  summary: string
  recommendations: string[]
  healthConcerns: string[]
  dietaryChanges: string[]
}

export async function analyzePoopImage(imageUrl: string, animalType: 'human' | 'dog'): Promise<PoopAnalysis> {
  try {
    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured')
    }

    console.log('API key available:', !!process.env.OPENAI_API_KEY)
    console.log('Image URL received:', imageUrl.substring(0, 50) + '...')
    console.log('Animal type:', animalType)

    const prompt = `You are a professional health analyst. Analyze this ${animalType} poop image and provide a comprehensive health assessment.

IMPORTANT: You MUST respond with ONLY valid JSON. Do not include any text before or after the JSON object.

Evaluation criteria:
- Color (should be brown for healthy)
- Consistency (should be well-formed, not too hard or soft)
- Shape and size
- Any visible abnormalities

Respond with ONLY this exact JSON format (no additional text):
{
  "rating": [number between 1-100],
  "summary": "[brief 2-3 sentence summary of the poop health]",
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "healthConcerns": ["concern 1 if any", "concern 2 if any"],
  "dietaryChanges": ["dietary change 1", "dietary change 2", "dietary change 3"]
}

Focus on practical, actionable advice. Be professional but friendly in tone.`

    console.log('Making OpenAI API call for image analysis...')
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
      temperature: 0.3,
      response_format: { type: "json_object" }
    })

    console.log('OpenAI response received:', {
      choices: response.choices?.length,
      finishReason: response.choices?.[0]?.finish_reason,
      hasContent: !!response.choices?.[0]?.message?.content
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      console.error('OpenAI response details:', {
        response: response,
        choice: response.choices?.[0],
        message: response.choices?.[0]?.message,
        finishReason: response.choices?.[0]?.finish_reason
      })
      throw new Error('OpenAI returned empty response. This may be due to content policy restrictions or image quality issues.')
    }

    console.log('OpenAI response content length:', content.length)

    // Try to parse the JSON response
    let analysis: PoopAnalysis
    try {
      analysis = JSON.parse(content) as PoopAnalysis
    } catch (parseError) {
      console.error('Failed to parse JSON response:', content)
      console.error('Parse error:', parseError)
      throw new Error('Invalid JSON response from OpenAI')
    }
    
    // Validate the response structure
    if (!analysis.rating || !analysis.summary || !analysis.recommendations) {
      console.error('Invalid response structure:', analysis)
      throw new Error('Invalid response structure from OpenAI')
    }

    console.log('Analysis completed successfully')
    return analysis
  } catch (error) {
    console.error('Error analyzing poop image:', error)
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('OpenAI API key is not configured')) {
        throw new Error('Service configuration error. Please contact support.')
      }
      if (error.message.includes('OpenAI returned empty response')) {
        throw new Error('Unable to analyze this image. Please ensure the image is clear and try again.')
      }
      if (error.message.includes('Invalid JSON response')) {
        throw new Error('Analysis service error. Please try again in a moment.')
      }
    }
    
    throw new Error('Failed to analyze image. Please try again.')
  }
} 