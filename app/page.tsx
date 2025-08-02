"use client"

import { useState } from 'react'
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ImageUpload } from '@/components/image-upload'
import { AnalysisResults } from '@/components/analysis-results'
import { Heart, Sparkles, Camera, History, Info, TrendingUp, Shield, Zap } from 'lucide-react'
import { analyzePoopImage, type PoopAnalysis } from '@/lib/openai'
import { db } from '@/lib/instant'
import Link from 'next/link'
import { getApiBaseUrl } from '@/lib/mobile-utils'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
}

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
    
          const response = await fetch(`${getApiBaseUrl()}/api/upload`, {
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
      const response = await fetch(`${getApiBaseUrl()}/api/analyze`, {
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
    // Analysis is now automatically saved when performed
    // This function can be used for additional save operations if needed
    console.log('Analysis already saved to history')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-slate-950/80 border-b border-white/20 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-3xl animate-pulse">💩</div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                              What's Poopin
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">AI-Powered Health Analysis</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <SignedOut>
              <SignInButton>
                <Button variant="gradient" size="lg" className="shadow-xl hover:shadow-2xl transition-shadow">
                  Sign In to Analyze
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/history">
                <Button variant="ghost" size="icon" className="hover:bg-white/20 backdrop-blur-sm">
                  <History className="h-5 w-5" />
                </Button>
              </Link>
              <UserButton />
            </SignedIn>
          </motion.div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <SignedOut>
          {/* Enhanced Landing Page */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center space-y-12"
          >
            <motion.div variants={itemVariants}>
              <div className="text-8xl mb-8 animate-bounce">💎💩</div>
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Revolutionize Your Health
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
                Get professional-grade analysis of your health through advanced AI vision technology. 
                Receive personalized dietary recommendations and health insights for both humans and dogs!
              </p>
              
              <div className="flex items-center justify-center gap-6 mb-8">
                <Badge className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg">
                  <Shield className="h-4 w-4 mr-2" />
                  Medical Grade AI
                </Badge>
                <Badge className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0 shadow-lg">
                  <Zap className="h-4 w-4 mr-2" />
                  Instant Results
                </Badge>
                <Badge className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0 shadow-lg">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Precision Scoring
                </Badge>
              </div>
            </motion.div>

            <motion.div
              variants={containerVariants}
              className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            >
              <motion.div variants={itemVariants}>
                <Card className="text-center h-full border-0 shadow-xl bg-gradient-to-br from-white to-blue-50 dark:from-slate-900 dark:to-blue-950 hover:shadow-2xl transition-all duration-300 group">
                  <CardHeader>
                    <div className="mx-auto mb-4 p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Camera className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold">Smart Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">
                      Upload a photo and our advanced AI analyzes it with medical-grade precision in seconds
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="text-center h-full border-0 shadow-xl bg-gradient-to-br from-white to-purple-50 dark:from-slate-900 dark:to-purple-950 hover:shadow-2xl transition-all duration-300 group">
                  <CardHeader>
                    <div className="mx-auto mb-4 p-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold">Detailed Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">
                      Get comprehensive health scores with precise decimal ratings and detailed breakdown analysis
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="text-center h-full border-0 shadow-xl bg-gradient-to-br from-white to-green-50 dark:from-slate-900 dark:to-green-950 hover:shadow-2xl transition-all duration-300 group">
                  <CardHeader>
                    <div className="mx-auto mb-4 p-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Heart className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold">Personalized Care</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">
                      Receive tailored dietary recommendations and health guidance to optimize your wellness journey
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <SignInButton>
                <Button 
                  size="xl" 
                  variant="gradient" 
                  className="text-xl px-16 py-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
                >
                  <Sparkles className="h-6 w-6 mr-3" />
                  Start Your Health Journey
                </Button>
              </SignInButton>
            </motion.div>
          </motion.div>
        </SignedOut>

        <SignedIn>
          {/* Enhanced Main App */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="text-center">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome back, {user?.firstName}! 👋
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">Ready for your next health analysis?</p>
            </motion.div>

            {!analysis && (
              <motion.div variants={itemVariants}>
                <Card className="max-w-2xl mx-auto border-0 shadow-2xl bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-950 dark:to-purple-950">
                  <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold">New Health Analysis</CardTitle>
                    <div className="flex justify-center gap-4 mt-6">
                      <Button
                        variant={animalType === 'human' ? 'default' : 'outline'}
                        onClick={() => setAnimalType('human')}
                        className={`flex items-center gap-3 px-6 py-3 text-lg transition-all duration-300 ${
                          animalType === 'human' 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl scale-105' 
                            : 'bg-white/80 backdrop-blur-sm border-2 hover:bg-blue-50'
                        }`}
                        size="lg"
                      >
                        <span className="text-2xl">👤</span>
                        Human
                      </Button>
                      <Button
                        variant={animalType === 'dog' ? 'default' : 'outline'}
                        onClick={() => setAnimalType('dog')}
                        className={`flex items-center gap-3 px-6 py-3 text-lg transition-all duration-300 ${
                          animalType === 'dog' 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl scale-105' 
                            : 'bg-white/80 backdrop-blur-sm border-2 hover:bg-green-50'
                        }`}
                        size="lg"
                      >
                        <span className="text-2xl">🐕</span>
                        Dog
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <ImageUpload
                      onImageSelect={setSelectedImage}
                      selectedImage={selectedImage}
                      disabled={isAnalyzing}
                    />
                    
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-lg"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">⚠️</span>
                          <span className="font-medium">{error}</span>
                        </div>
                      </motion.div>
                    )}

                    <div className="text-center">
                      <Button
                        onClick={handleAnalyze}
                        disabled={!selectedImage || isAnalyzing}
                        size="xl"
                        variant="gradient"
                        className="min-w-[250px] shadow-xl hover:shadow-2xl transition-all duration-300"
                      >
                        {isAnalyzing ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                            Analyzing Your Sample...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-5 w-5 mr-3" />
                            Analyze Health Score
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-blue-500 rounded-lg">
                          <Info className="h-5 w-5 text-white" />
                        </div>
                        <div className="text-sm text-blue-800 dark:text-blue-200">
                          <p className="font-semibold mb-2">Privacy & Image Guidelines</p>
                          <p className="leading-relaxed mb-3">
                            Your images are analyzed securely with end-to-end encryption and not stored permanently. 
                            Our AI provides precise decimal scoring (not rounded to 5s) for more nuanced health insights.
                            This analysis is for informational purposes and should complement professional medical advice.
                          </p>
                          <p className="leading-relaxed">
                            <strong>For best results:</strong> Ensure the sample is clearly visible, well-lit, and in focus. 
                            Our AI can analyze samples in various environments (grass, ground, pavement, etc.) as long as the sample itself is clearly visible.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {analysis && (
              <motion.div
                variants={itemVariants}
                className="max-w-4xl mx-auto"
              >
                <AnalysisResults
                  analysis={analysis}
                  animalType={animalType}
                  imageUrl={selectedImage ? URL.createObjectURL(selectedImage) : ""}
                  onSave={handleSaveAnalysis}
                  onShare={() => {
                    // TODO: Implement sharing functionality
                  }}
                />
                
                <div className="text-center mt-12">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setAnalysis(null)
                      setSelectedImage(null)
                      setError('')
                    }}
                    size="lg"
                    className="bg-white/50 backdrop-blur-sm border-2 hover:bg-white/80 transition-all duration-300"
                  >
                    <Camera className="h-5 w-5 mr-2" />
                    Analyze Another Sample
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </SignedIn>
      </main>
    </div>
  )
}
