"use client"

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Calendar, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { generatePoopEmoji, getHealthCategory, formatDate } from '@/lib/utils'
import { db, type Analysis, initializeSchema } from '@/lib/instant'
import Link from 'next/link'

export default function HistoryPage() {
  const { user } = useUser()
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  // Query analyses from InstantDB
  const { data, isLoading, error: queryError } = db.useQuery({
    analyses: {
      $: {
        where: {
          userId: user?.id || '',
        },
        order: {
          createdAt: 'desc'
        }
      }
    }
  })

  // Simple test query to see if InstantDB is working
  const { data: testData } = db.useQuery({
    analyses: {
      $: {}
    }
  })

  // Debug query
  console.log('Query debug:', {
    userId: user?.id,
    query: {
      analyses: {
        $: {
          where: {
            userId: user?.id || '',
          },
          order: {
            createdAt: 'desc'
          }
        }
      }
    },
    testData: testData?.analyses?.length || 0
  })

  useEffect(() => {
    if (queryError) {
      console.error('InstantDB query error:', queryError)
      setError(queryError.toString())
    }
  }, [queryError])

  // Initialize schema when component mounts
  useEffect(() => {
    if (user?.id) {
      initializeSchema().catch(console.error)
    }
  }, [user?.id])

  useEffect(() => {
    console.log('History page debug:', { user, data, isLoading, error })
    console.log('InstantDB app ID:', process.env.NEXT_PUBLIC_INSTANT_APP_ID)
    
    if (!isLoading && data?.analyses) {
      setAnalyses(data.analyses as Analysis[])
      setLoading(false)
    } else if (!isLoading && !data?.analyses) {
      console.log('No analyses found or error occurred')
      setLoading(false)
    }
  }, [data, isLoading, user])

  const getTrend = (currentRating: number, previousRating?: number) => {
    if (!previousRating) return null
    if (currentRating > previousRating) return 'up'
    if (currentRating < previousRating) return 'down'
    return 'stable'
  }

  const getAverageRating = () => {
    if (analyses.length === 0) return 0
    return Math.round(analyses.reduce((sum, analysis) => sum + analysis.rating, 0) / analyses.length)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Check if InstantDB is properly configured
  if (!process.env.NEXT_PUBLIC_INSTANT_APP_ID) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold mb-2">Configuration Error</h3>
            <p className="text-gray-600 mb-6">
              InstantDB is not properly configured. Please add NEXT_PUBLIC_INSTANT_APP_ID to your .env.local file.
            </p>
            <div className="bg-gray-100 p-4 rounded-lg mb-6 text-left">
              <p className="text-sm font-mono">NEXT_PUBLIC_INSTANT_APP_ID=your_instant_app_id</p>
            </div>
            <Link href="/">
              <Button variant="gradient">
                Go Back Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Check if user is authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🔐</div>
            <h3 className="text-xl font-semibold mb-2">Authentication Required</h3>
            <p className="text-gray-600 mb-6">
              Please sign in to view your health history.
            </p>
            <Link href="/">
              <Button variant="gradient">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Health History</h1>
              <p className="text-gray-600">Track your wellness journey over time</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={async () => {
                try {
                  await initializeSchema()
                } catch (err) {
                  console.error('Failed to initialize schema:', err)
                }
              }}
              variant="outline"
              size="sm"
            >
              Init Schema
            </Button>
            <Button 
              onClick={async () => {
                try {
                  await db.transact([
                    db.tx.analyses[crypto.randomUUID()].update({
                      userId: user?.id || '',
                      imageUrl: 'https://example.com/test.jpg',
                      rating: 85,
                      summary: 'Test analysis - This is a test entry to verify InstantDB is working.',
                      recommendations: ['Test recommendation 1', 'Test recommendation 2'],
                      animalType: 'human' as const,
                      createdAt: Date.now(),
                      isPublic: false,
                    })
                  ])
                  console.log('Test data created successfully')
                } catch (err) {
                  console.error('Failed to create test data:', err)
                }
              }}
              variant="outline"
              size="sm"
            >
              Add Test Data
            </Button>
            <Button 
              onClick={() => {
                setLoading(true)
                setError('')
                // Force a refresh by updating the query
                window.location.reload()
              }}
              variant="outline"
              size="sm"
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        {analyses.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total Analyses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyses.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Average Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">{getAverageRating()}/100</div>
                  <div className="text-2xl">{generatePoopEmoji(getAverageRating())}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Latest Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {(() => {
                    const trend = getTrend(analyses[0]?.rating, analyses[1]?.rating)
                    if (trend === 'up') return <TrendingUp className="h-6 w-6 text-green-500" />
                    if (trend === 'down') return <TrendingDown className="h-6 w-6 text-red-500" />
                    return <Minus className="h-6 w-6 text-gray-500" />
                  })()}
                  <span className="text-sm font-medium">
                    {(() => {
                      const trend = getTrend(analyses[0]?.rating, analyses[1]?.rating)
                      if (trend === 'up') return 'Improving'
                      if (trend === 'down') return 'Declining'
                      return 'Stable'
                    })()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="text-2xl">⚠️</div>
                <div>
                  <h3 className="font-semibold text-red-800">Error Loading Data</h3>
                  <p className="text-red-600 text-sm">{error}</p>
                  <p className="text-red-500 text-xs mt-2">
                    This might be due to InstantDB configuration issues. Please check your NEXT_PUBLIC_INSTANT_APP_ID environment variable.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analysis History */}
        {analyses.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">No analyses yet</h3>
              <p className="text-gray-600 mb-6">
                Start tracking your health by analyzing your first sample!
              </p>
              <div className="text-xs text-gray-500 mb-4">
                Debug: User ID: {user?.id} | Loading: {isLoading.toString()} | Data: {data ? 'Present' : 'None'} | Total Records: {testData?.analyses?.length || 0}
              </div>
              <Link href="/">
                <Button variant="gradient">
                  Start Analysis
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {analyses.map((analysis, index) => {
              const { category, color } = getHealthCategory(analysis.rating)
              const emoji = generatePoopEmoji(analysis.rating)
              const trend = getTrend(analysis.rating, analyses[index + 1]?.rating)

              return (
                <motion.div
                  key={analysis.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-3xl">{emoji}</div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-semibold text-lg">
                                Score: {analysis.rating}/100
                              </h3>
                              <Badge className={color}>{category}</Badge>
                              <Badge variant="outline">
                                {analysis.animalType === 'human' ? '👤 Human' : '🐕 Dog'}
                              </Badge>
                              {trend && (
                                <div className="flex items-center gap-1">
                                  {trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
                                  {trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
                                  {trend === 'stable' && <Minus className="h-4 w-4 text-gray-500" />}
                                </div>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm line-clamp-2">
                              {analysis.summary}
                            </p>
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(new Date(analysis.createdAt))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
} 