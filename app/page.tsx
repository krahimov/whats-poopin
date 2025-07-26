"use client"

import { useState } from 'react'
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ImageUpload } from '@/components/image-upload'
import { AnalysisResults } from '@/components/analysis-results'
import { Heart, Sparkles, Camera, History, Info } from 'lucide-react'
import { analyzePoopImage, type PoopAnalysis } from '@/lib/openai'
import { db } from '@/lib/instant'
import Link from 'next/link'

export default function Home() {
  const { user } = useUser()
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [animalType, setAnimalType] = useState<'human' | 'dog'>('human')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<PoopAnalysis | null>(null)
  const [error, setError] = useState<string>('')

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) {
      throw new Error('Failed to upload image')
    }
    
    const data = await response.json()
    return data.url
  }

  const handleAnalyze = async () => {
    if (!selectedImage) return

    setIsAnalyzing(true)
    setError('')
    setAnalysis(null)

    try {
      // Upload image first
      const imageUrl = await uploadImageToCloudinary(selectedImage)
      
      // Analyze with our API
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl,
          animalType,
        }),
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const analysisResult = await response.json()
      setAnalysis(analysisResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSaveAnalysis = async () => {
    if (!analysis || !user || !selectedImage) return

    try {
      const imageUrl = await uploadImageToCloudinary(selectedImage)
      
      await db.transact([
        db.tx.analyses[crypto.randomUUID()].update({
          userId: user.id,
          imageUrl,
          rating: analysis.rating,
          summary: analysis.summary,
          recommendations: analysis.recommendations,
          animalType,
          createdAt: Date.now(),
          isPublic: false,
        })
      ])
    } catch (err) {
      console.error('Failed to save analysis:', err)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">💩</div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PoopScore
              </h1>
              <p className="text-sm text-gray-600">AI-Powered Health Analysis</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton>
                <Button variant="gradient" size="lg">
                  Sign In to Analyze
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/history">
                <Button variant="ghost" size="icon">
                  <History className="h-5 w-5" />
                </Button>
              </Link>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <SignedOut>
          {/* Landing Page */}
          <div className="text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-8xl mb-6">💎💩</div>
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Understand Your Health Through AI
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                Get professional-grade analysis of your poop health with personalized dietary recommendations. 
                Available for both humans and dogs!
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto"
            >
              <Card className="text-center">
                <CardHeader>
                  <Camera className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                  <CardTitle>Upload & Analyze</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Simply upload a photo and our AI will analyze it instantly
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Sparkles className="h-8 w-8 mx-auto text-purple-500 mb-2" />
                  <CardTitle>AI-Powered Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Get detailed health scores and professional recommendations
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Heart className="h-8 w-8 mx-auto text-red-500 mb-2" />
                  <CardTitle>Improve Your Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Follow personalized dietary advice to optimize your wellness
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <SignInButton>
              <Button size="xl" variant="gradient" className="text-lg px-12 py-6">
                Start Your Health Journey
              </Button>
            </SignInButton>
          </div>
        </SignedOut>

        <SignedIn>
          {/* Main App */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">
                Welcome back, {user?.firstName}! 👋
              </h2>
              <p className="text-gray-600">Upload a photo to get your health analysis</p>
            </div>

            {!analysis && (
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-center">New Health Analysis</CardTitle>
                  <div className="flex justify-center gap-4">
                    <Button
                      variant={animalType === 'human' ? 'default' : 'outline'}
                      onClick={() => setAnimalType('human')}
                      className="flex items-center gap-2"
                    >
                      <span>👤</span>
                      Human
                    </Button>
                    <Button
                      variant={animalType === 'dog' ? 'default' : 'outline'}
                      onClick={() => setAnimalType('dog')}
                      className="flex items-center gap-2"
                    >
                      <span>🐕</span>
                      Dog
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ImageUpload
                    onImageSelect={setSelectedImage}
                    selectedImage={selectedImage}
                    disabled={isAnalyzing}
                  />
                  
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  <div className="text-center">
                    <Button
                      onClick={handleAnalyze}
                      disabled={!selectedImage || isAnalyzing}
                      size="lg"
                      variant="gradient"
                      className="min-w-[200px]"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Analyze Health
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-700">
                        <p className="font-medium mb-1">Privacy & Accuracy Notice</p>
                        <p>
                          Your images are analyzed securely and not stored permanently. 
                          This analysis is for informational purposes only and should not replace professional medical advice.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {analysis && (
              <div className="max-w-3xl mx-auto">
                <AnalysisResults
                  analysis={analysis}
                  animalType={animalType}
                  imageUrl=""
                  onSave={handleSaveAnalysis}
                  onShare={() => {
                    // TODO: Implement sharing functionality
                  }}
                />
                
                <div className="text-center mt-8">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setAnalysis(null)
                      setSelectedImage(null)
                      setError('')
                    }}
                  >
                    Analyze Another Sample
                  </Button>
                </div>
              </div>
            )}
          </div>
        </SignedIn>
      </main>
    </div>
  )
}
