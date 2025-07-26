import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export interface HealthMetrics {
  color: number
  consistency: number
  shape: number
  frequency: number
  volume: number
}

export interface PoopAnalysis {
  rating: number
  healthMetrics: HealthMetrics
  summary: string
  recommendations: string[]
  healthConcerns: string[]
  dietaryChanges: string[]
  urgencyLevel: 'low' | 'medium' | 'high'
  detailedBreakdown: {
    colorAnalysis: string
    consistencyAnalysis: string
    shapeAnalysis: string
    overallHealth: string
  }
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

    const prompt = `You are a professional veterinary and medical health analyst with expertise in digestive health assessment. Analyze this ${animalType} poop image and provide a comprehensive, precise health assessment.

IMPORTANT CONTEXT:
- This image may show poop in various environments (grass, ground, pavement, toilet, etc.)
- The sample may be in different lighting conditions or angles
- Focus on what you can observe, even if the image quality varies
- Be flexible in your analysis while maintaining professional standards

CRITICAL SCORING INSTRUCTIONS:
- DO NOT use round numbers or intervals of 5
- Provide precise decimal scores (e.g., 67.3, 82.7, 91.2)
- Base scores on actual visual evidence, not convenient numbers
- Each metric should reflect nuanced assessment
- If certain aspects are unclear due to image quality, estimate based on visible features

IMPORTANT: You MUST respond with ONLY valid JSON. Do not include any text before or after the JSON object.

Evaluation criteria for detailed analysis:
1. COLOR (0-100): Healthy brown variations vs concerning colors (green, black, white, red, yellow)
2. CONSISTENCY (0-100): Bristol Stool Scale assessment - ideal formed but soft vs too hard/too loose
3. SHAPE (0-100): Well-formed logs vs fragmented, pellets, or shapeless
4. FREQUENCY indicators (0-100): Based on visual cues about health patterns
5. VOLUME (0-100): Appropriate size relative to ${animalType}

Respond with ONLY this exact JSON format (no additional text):
{
  "rating": [precise decimal between 1-100, NOT rounded to 5s],
  "healthMetrics": {
    "color": [precise decimal 0-100],
    "consistency": [precise decimal 0-100], 
    "shape": [precise decimal 0-100],
    "frequency": [precise decimal 0-100],
    "volume": [precise decimal 0-100]
  },
  "summary": "[professional 2-3 sentence summary with specific observations]",
  "recommendations": ["specific recommendation 1", "specific recommendation 2", "specific recommendation 3"],
  "healthConcerns": ["specific concern 1 if any", "specific concern 2 if any"],
  "dietaryChanges": ["specific dietary change 1", "specific dietary change 2", "specific dietary change 3"],
  "urgencyLevel": "low|medium|high",
  "detailedBreakdown": {
    "colorAnalysis": "[detailed color assessment with specific observations]",
    "consistencyAnalysis": "[detailed consistency assessment with Bristol Scale reference]",
    "shapeAnalysis": "[detailed shape and formation assessment]",
    "overallHealth": "[comprehensive health interpretation]"
  }
}

Focus on evidence-based, precise assessment. Avoid generic advice - be specific to what you observe. If the image quality limits certain observations, note this in your analysis but still provide the best assessment possible.`

    console.log('Making OpenAI API call for detailed image analysis...')
    
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
      max_tokens: 1500,
      temperature: 0.1,
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
    if (!analysis.rating || !analysis.summary || !analysis.recommendations || !analysis.healthMetrics) {
      console.error('Invalid response structure:', analysis)
      throw new Error('Invalid response structure from OpenAI')
    }

    console.log('Analysis completed successfully with detailed metrics')
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