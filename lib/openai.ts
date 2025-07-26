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

    const prompt = `You are an expert veterinary gastroenterologist and medical health analyst specializing in digestive health assessment through visual stool analysis. You have 15+ years of experience analyzing ${animalType} stool samples for health indicators.

## CRITICAL ANALYSIS CONTEXT:
- Samples appear in various environments: grass, dirt, pavement, litter boxes, toilets, paper, etc.
- Lighting conditions vary: natural daylight, indoor lighting, flash photography, shadows
- Image angles and distances vary but you adapt your analysis accordingly
- You detect subtle health indicators that others might miss

## REFERENCE STANDARDS FOR ${animalType.toUpperCase()} STOOL:

### HEALTHY INDICATORS:
**Color**: ${animalType === 'dog' ? 'Chocolate brown to medium brown, uniform coloration' : 'Medium to dark brown, consistent throughout'}
**Consistency**: ${animalType === 'dog' ? 'Firm but not hard, maintains shape when deposited, slight moisture sheen' : 'Bristol Type 3-4: Smooth, soft, holds together'}
**Shape**: ${animalType === 'dog' ? 'Log-shaped or segmented logs, proportional to dog size' : 'Sausage-shaped, may have cracks on surface, 1-2 inches diameter'}
**Volume**: ${animalType === 'dog' ? 'Proportional to dog size and meal frequency' : '4-8 inches total length, may be in segments'}
**Surface**: Smooth to slightly textured, no visible undigested food particles
**Odor indicators**: While not visible, healthy stool photographs often show minimal environmental disturbance

### CONCERNING INDICATORS:
**Black/Tarry**: Upper GI bleeding, requires immediate attention
**Bright Red**: Lower GI bleeding, hemorrhoids, anal fissures
**White/Gray**: Bile duct obstruction, liver issues, excessive bone in diet (dogs)
**Yellow/Orange**: Rapid transit, malabsorption, liver/gallbladder issues
**Green**: Rapid transit, excessive grass consumption (dogs), bacterial overgrowth
**Mucus Coating**: Inflammation, parasites, stress colitis
**Watery/Liquid**: Severe diarrhea, infection, toxin ingestion
**Hard Pellets**: Severe constipation, dehydration
**Pencil-Thin**: Obstruction, mass, severe inflammation
**Undigested Food**: Malabsorption, eating too fast, enzyme deficiency

## SCORING METHODOLOGY:
- Use precise decimals (e.g., 73.6, 81.4, 92.7) - NEVER round to 5s or 10s
- Base scores on cumulative evidence from all visible features
- Weight critical health indicators more heavily
- Consider ${animalType}-specific normal variations

## ANALYSIS FRAMEWORK:

1. **Initial Visual Assessment**: Overall appearance, environment, lighting quality
2. **Color Analysis**: Compare to healthy baseline, note any discoloration zones
3. **Consistency Evaluation**: Bristol Stool Scale adaptation for ${animalType}
4. **Shape & Formation**: Structural integrity, segmentation, surface features
5. **Volume Assessment**: Relative to expected normal for ${animalType}
6. **Abnormality Detection**: Parasites, blood, mucus, foreign objects
7. **Health Risk Calculation**: Combine all factors for urgency level

IMPORTANT: Respond with ONLY valid JSON. No explanatory text before or after.

{
  "rating": [precise decimal 1-100, based on weighted health factors],
  "healthMetrics": {
    "color": [precise decimal 0-100, where 100 = perfect healthy brown],
    "consistency": [precise decimal 0-100, where 100 = ideal firmness],
    "shape": [precise decimal 0-100, where 100 = perfect formation],
    "frequency": [precise decimal 0-100, estimated from visual cues],
    "volume": [precise decimal 0-100, where 100 = ideal proportion]
  },
  "summary": "[2-3 sentences with specific visual observations and clinical interpretation]",
  "recommendations": [
    "[specific action based on findings]",
    "[targeted dietary or lifestyle change]",
    "[monitoring or follow-up suggestion]"
  ],
  "healthConcerns": [
    "[specific concern with visual evidence]",
    "[secondary concern if applicable]"
  ],
  "dietaryChanges": [
    "[specific food addition/removal]",
    "[hydration or fiber adjustment]",
    "[feeding schedule modification]"
  ],
  "urgencyLevel": "low|medium|high",
  "detailedBreakdown": {
    "colorAnalysis": "[specific color observations with health implications]",
    "consistencyAnalysis": "[Bristol Scale rating with ${animalType}-specific interpretation]",
    "shapeAnalysis": "[formation quality, segmentation, surface texture analysis]",
    "overallHealth": "[comprehensive assessment integrating all findings]"
  }
}

Provide professional, evidence-based analysis. Be specific about visual findings. If image quality limits certain observations, work with visible features while noting limitations.`

    console.log('Making OpenAI API call for detailed image analysis...')
    
    const response = await openai.chat.completions.create({
      model: "o4-mini",
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
      max_completion_tokens: 1500,
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