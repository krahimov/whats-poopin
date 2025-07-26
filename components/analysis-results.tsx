"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Share2, Save, AlertTriangle, Heart, TrendingUp, Activity, Zap, Eye, CircleDot } from 'lucide-react'
import { generatePoopEmoji, getHealthCategory, formatDate } from '@/lib/utils'
import type { PoopAnalysis } from '@/lib/openai'
import { cn } from '@/lib/utils'

interface AnalysisResultsProps {
  analysis: PoopAnalysis
  animalType: 'human' | 'dog'
  imageUrl: string
  onSave?: () => void
  onShare?: () => void
  isSaving?: boolean
}

interface MetricCardProps {
  title: string
  value: number
  icon: React.ElementType
  color: string
  description: string
}

function MetricCard({ title, value, icon: Icon, color, description }: MetricCardProps) {
  const getGradientColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600'
    if (score >= 60) return 'from-blue-500 to-cyan-600'
    if (score >= 40) return 'from-yellow-500 to-orange-500'
    return 'from-red-500 to-rose-600'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-xl bg-gradient-to-r", getGradientColor(value))}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300">{title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-gray-100 dark:to-gray-300">
                {value.toFixed(1)}
              </div>
              <div className="text-xs text-gray-500">/ 100</div>
            </div>
          </div>
          <div className="relative">
            <Progress value={value} className="h-2" />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${value}%` }}
              transition={{ duration: 1, delay: 0.2 }}
              className={cn("absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r", getGradientColor(value))}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function UrgencyBadge({ level }: { level: 'low' | 'medium' | 'high' }) {
  const configs = {
    low: { 
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: '🟢',
      text: 'Low Priority'
    },
    medium: { 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: '🟡',
      text: 'Monitor Closely'
    },
    high: { 
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: '🔴',
      text: 'Needs Attention'
    }
  }

  const config = configs[level]

  return (
    <Badge className={cn("px-3 py-1 border", config.color)}>
      <span className="mr-2">{config.icon}</span>
      {config.text}
    </Badge>
  )
}

export function AnalysisResults({ 
  analysis, 
  animalType, 
  imageUrl, 
  onSave, 
  onShare, 
  isSaving 
}: AnalysisResultsProps) {
  const { category, color } = getHealthCategory(analysis.rating)
  const emoji = generatePoopEmoji(analysis.rating)

  const metrics = [
    {
      title: 'Color Health',
      value: analysis.healthMetrics.color,
      icon: Eye,
      color: 'blue',
      description: 'Pigmentation analysis'
    },
    {
      title: 'Consistency',
      value: analysis.healthMetrics.consistency,
      icon: Activity,
      color: 'green',
      description: 'Bristol scale rating'
    },
    {
      title: 'Shape & Form',
      value: analysis.healthMetrics.shape,
      icon: CircleDot,
      color: 'purple',
      description: 'Structural integrity'
    },
    {
      title: 'Health Pattern',
      value: analysis.healthMetrics.frequency,
      icon: TrendingUp,
      color: 'orange',
      description: 'Pattern indicators'
    },
    {
      title: 'Volume Score',
      value: analysis.healthMetrics.volume,
      icon: Zap,
      color: 'red',
      description: 'Size assessment'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Hero Score Card */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 border-2 border-indigo-200 dark:from-indigo-950 dark:via-blue-950 dark:to-purple-950">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
        <CardHeader className="relative text-center pb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="text-8xl mb-6"
          >
            {emoji}
          </motion.div>
          <CardTitle className="text-4xl font-bold mb-3 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            PoopScore: {analysis.rating.toFixed(1)}
          </CardTitle>
          <div className="flex items-center justify-center gap-4">
            <Badge className={cn("text-lg px-6 py-2 shadow-lg", color)}>
              {category} Health
            </Badge>
            <UrgencyBadge level={analysis.urgencyLevel} />
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="space-y-6">
            <div className="relative">
              <div className="flex justify-between text-sm mb-3 font-medium">
                <span className="text-gray-700 dark:text-gray-300">Overall Health Score</span>
                <span className="font-bold text-gray-900 dark:text-gray-100">{analysis.rating.toFixed(1)}/100</span>
              </div>
              <div className="relative">
                <Progress value={analysis.rating} className="h-4 bg-white/50" />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${analysis.rating}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute top-0 left-0 h-4 rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 shadow-lg"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <Heart className="h-4 w-4 text-red-500" />
              <span>Analysis for {animalType === 'human' ? 'Human' : 'Dog'} Health</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Health Metrics */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Detailed Health Metrics</h3>
          <p className="text-gray-600 dark:text-gray-400">Comprehensive breakdown of health indicators</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <MetricCard {...metric} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Summary Card */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <span className="text-white text-lg">📋</span>
            </div>
            Professional Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">{analysis.summary}</p>
        </CardContent>
      </Card>

      {/* Detailed Breakdown */}
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg">
              <Activity className="h-5 w-5 text-white" />
            </div>
            Detailed Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Color Analysis</h4>
              <p className="text-blue-700 dark:text-blue-300 text-sm">{analysis.detailedBreakdown.colorAnalysis}</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Consistency Assessment</h4>
              <p className="text-green-700 dark:text-green-300 text-sm">{analysis.detailedBreakdown.consistencyAnalysis}</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
              <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Shape Analysis</h4>
              <p className="text-purple-700 dark:text-purple-300 text-sm">{analysis.detailedBreakdown.shapeAnalysis}</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
              <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Overall Health</h4>
              <p className="text-orange-700 dark:text-orange-300 text-sm">{analysis.detailedBreakdown.overallHealth}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Concerns Card */}
      {analysis.healthConcerns.length > 0 && (
        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-orange-800 dark:text-orange-200">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              Health Concerns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {analysis.healthConcerns.map((concern, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-white/50 rounded-lg"
                >
                  <span className="text-orange-500 mt-1 text-lg">⚠️</span>
                  <span className="text-orange-800 dark:text-orange-200">{concern}</span>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Recommendations Card */}
      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-green-800 dark:text-green-200">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
              <span className="text-white text-lg">💡</span>
            </div>
            Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {analysis.recommendations.map((recommendation, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 bg-white/50 rounded-lg"
              >
                <span className="text-green-500 mt-1 text-lg">✅</span>
                <span className="text-green-800 dark:text-green-200">{recommendation}</span>
              </motion.li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Dietary Changes Card */}
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-blue-800 dark:text-blue-200">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
              <span className="text-white text-lg">🍽️</span>
            </div>
            Dietary Optimization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {analysis.dietaryChanges.map((change, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 bg-white/50 rounded-lg"
              >
                <span className="text-blue-500 mt-1 text-lg">🥗</span>
                <span className="text-blue-800 dark:text-blue-200">{change}</span>
              </motion.li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center pt-4">
        {onSave && (
          <Button 
            onClick={onSave} 
            disabled={isSaving}
            size="lg"
            className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
          >
            <Save className="h-5 w-5" />
            {isSaving ? 'Saving Analysis...' : 'Save to History'}
          </Button>
        )}
        {onShare && (
          <Button 
            variant="outline" 
            onClick={onShare}
            size="lg"
            className="flex items-center gap-3 border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <Share2 className="h-5 w-5" />
            Share Results
          </Button>
        )}
      </div>
    </motion.div>
  )
} 