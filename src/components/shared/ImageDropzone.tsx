'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from "@/hooks/use-toast"

interface ImageDropzoneProps {
  onFileSelect: (file: File) => void
  onFileRemove: () => void
  maxSize?: number
}

export function ImageDropzone({ 
  onFileSelect, 
  onFileRemove, 
  maxSize = 5242880
}: ImageDropzoneProps) {
  const { toast } = useToast()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const fileUrl = URL.createObjectURL(file)
      setPreviewUrl(fileUrl)
      onFileSelect(file)
      toast({
        title: "File Uploaded",
        description: `${file.name} uploaded successfully.`,
      })
    }
  }, [onFileSelect, toast])

  const handleRemove = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(null)
    onFileRemove()
    toast({
      title: "File Removed",
      description: "Uploaded file has been removed.",
    })
  }, [previewUrl, onFileRemove, toast])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpeg", ".jpg", ".svg"] },
    maxSize,
    multiple: false
  })

  if (previewUrl) {
    return (
      <div className="relative rounded-lg overflow-hidden bg-gray-800"  >
        <img
          src={previewUrl}
          alt="Preview"
          className="w-full max-h-48 object-cover"
        />
        <Button
          type="button"
          size="sm"
          variant="destructive"
          className="absolute top-2 right-2"
          onClick={handleRemove}
          aria-label="Remove image"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={`
        relative h-40 rounded-lg border-2 border-dashed
        transition-colors duration-150 ease-in-out cursor-pointer
        flex items-center justify-center p-4 text-center
        ${isDragActive 
          ? 'border-blue-600 bg-blue-600/10' 
          : 'border-gray-700 bg-gray-700 hover:bg-gray-600/50'
        }
      `}
    >
      <input {...getInputProps()} />
      <div className="space-y-2 text-gray-200">
        <p className="text-sm">
          {isDragActive
            ? 'Drop your image here...'
            : 'Drag & drop your image here, or click to select one'
          }
        </p>
        <p className="text-xs text-gray-400">
          Supported formats: PNG, JPEG, SVG (max {Math.floor(maxSize / 1024 / 1024)}MB)
        </p>
      </div>
    </div>
  )
}

