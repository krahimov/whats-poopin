"use client"

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Image as ImageIcon, Camera, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  onImageSelect: (file: File) => void
  selectedImage?: File | null
  disabled?: boolean
}

export function ImageUpload({ onImageSelect, selectedImage, disabled }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file)
    }
  }, [onImageSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false,
    disabled,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  })

  const clearImage = () => {
    onImageSelect(null as any)
  }

  if (selectedImage) {
    return (
      <div className="relative">
        <div className="relative aspect-square w-full max-w-md mx-auto rounded-2xl overflow-hidden border-4 border-dashed border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 shadow-xl">
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Selected sample"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          
          {/* Success overlay */}
          <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full flex items-center gap-2 shadow-lg">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Ready to analyze!</span>
          </div>

          <Button
            variant="destructive"
            size="icon"
            className="absolute top-4 right-4 shadow-lg hover:scale-110 transition-transform"
            onClick={clearImage}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-center mt-4 space-y-3">
          <p className="text-sm text-gray-600 font-medium">{selectedImage.name}</p>
          <p className="text-xs text-gray-500">
            {(selectedImage.size / 1024 / 1024).toFixed(2)} MB • Ready for analysis
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={clearImage}
            disabled={disabled}
            className="bg-white/80 backdrop-blur-sm border-2 hover:bg-blue-50 transition-all duration-300"
          >
            <Camera className="h-4 w-4 mr-2" />
            Change Image
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          "relative aspect-square w-full max-w-md mx-auto rounded-2xl border-3 border-dashed transition-all duration-300 cursor-pointer overflow-hidden group",
          isDragActive 
            ? "border-blue-500 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 scale-105 shadow-2xl" 
            : "border-gray-300 bg-gradient-to-br from-gray-50 to-white hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 hover:shadow-xl",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
      <input {...getInputProps()} />
      
      {/* Background gradient animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
        {isDragActive ? (
          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <div className="p-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-xl">
                <Upload className="h-8 w-8 text-white" />
              </div>
            </div>
            <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Drop it here! 🎯
            </p>
            <p className="text-sm text-blue-600 mt-2">Release to upload your sample</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="relative mb-6 group-hover:scale-110 transition-transform duration-300">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <Camera className="h-10 w-10 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
                  <div className="absolute -top-1 -right-1">
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
                Upload Sample Photo
              </p>
              <p className="text-sm text-gray-600 max-w-xs leading-relaxed">
                Drag and drop or click to select your sample image for AI health analysis
              </p>
              
              <div>
                <Button 
                  variant="outline" 
                  size="lg" 
                  disabled={disabled}
                  className="mt-4 bg-white/80 backdrop-blur-sm border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <ImageIcon className="h-5 w-5 mr-2" />
                  Choose File
                </Button>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-4">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span>JPG</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  <span>PNG</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full" />
                  <span>WEBP</span>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
        
        {/* Animated border effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-[3px]">
            <div className="w-full h-full rounded-2xl bg-white" />
          </div>
        </div>
      </div>
    </div>
  )
} 