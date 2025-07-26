"use client"

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Calendar, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { generatePoopEmoji, getHealthCategory, formatDate } from '@/lib/utils'
import { db, type Analysis } from '@/lib/instant'
import Link from 'next/link'

export default function HistoryPage() {
  const { user } = useUser()
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [loading, setLoading] = useState(true)

  // Query analyses from InstantDB
  const { data, isLoading } = db.useQuery({
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

  useEffect(() => {
    if (!isLoading && data?.analyses) {
      setAnalyses(data.analyses as Analysis[])
      setLoading(false)
    }
  }, [data, isLoading])

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

        {/* Analysis History */}
        {analyses.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">No analyses yet</h3>
              <p className="text-gray-600 mb-6">
                Start tracking your health by analyzing your first sample!
              </p>
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