"use client"

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
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
        <div className="relative aspect-square w-full max-w-md mx-auto rounded-xl overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50">
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Selected poop"
            className="w-full h-full object-cover"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={clearImage}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-gray-600 text-center mt-2">{selectedImage.name}</p>
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative aspect-square w-full max-w-md mx-auto rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition-colors duration-200 cursor-pointer hover:border-blue-400 hover:bg-blue-50",
        isDragActive && "border-blue-500 bg-blue-100",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <input {...getInputProps()} />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
        {isDragActive ? (
          <>
            <Upload className="h-12 w-12 text-blue-500 mb-4" />
            <p className="text-lg font-medium text-blue-700">Drop the image here!</p>
          </>
        ) : (
          <>
            <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Upload a poop photo
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Drag and drop or click to select
            </p>
            <Button variant="outline" size="sm" disabled={disabled}>
              Choose Image
            </Button>
          </>
        )}
      </div>
    </div>
  )
} 