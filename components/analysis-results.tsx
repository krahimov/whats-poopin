"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Share2, Save, AlertTriangle, Heart } from 'lucide-react'
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header Card with Rating */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4">{emoji}</div>
          <CardTitle className="text-3xl font-bold mb-2">
            PoopScore: {analysis.rating}/100
          </CardTitle>
          <Badge className={cn("text-lg px-4 py-2", color)}>
            {category} Health
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Health Score</span>
                <span className="font-medium">{analysis.rating}/100</span>
              </div>
              <Progress value={analysis.rating} className="h-3" />
            </div>
            
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Heart className="h-4 w-4" />
              <span>Analysis for {animalType === 'human' ? 'Human' : 'Dog'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📋</span>
            Health Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{analysis.summary}</p>
        </CardContent>
      </Card>

      {/* Health Concerns Card */}
      {analysis.healthConcerns.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              Health Concerns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.healthConcerns.map((concern, index) => (
                <li key={index} className="flex items-start gap-2 text-orange-700">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>{concern}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Recommendations Card */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <span>💡</span>
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {analysis.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-2 text-green-700">
                <span className="text-green-500 mt-1">✓</span>
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Dietary Changes Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <span>🍽️</span>
            Suggested Dietary Changes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {analysis.dietaryChanges.map((change, index) => (
              <li key={index} className="flex items-start gap-2 text-blue-700">
                <span className="text-blue-500 mt-1">🥗</span>
                <span>{change}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        {onSave && (
          <Button 
            onClick={onSave} 
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Analysis'}
          </Button>
        )}
        {onShare && (
          <Button 
            variant="outline" 
            onClick={onShare}
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share Results
          </Button>
        )}
      </div>
    </motion.div>
  )
} 