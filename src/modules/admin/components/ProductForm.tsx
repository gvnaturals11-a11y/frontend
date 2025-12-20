'use client'

import React, { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Product } from '@/types/product.types'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { CreateProductRequest } from '@/lib/api/admin.api'
import { Upload, X } from 'lucide-react'
import { API_BASE_URL } from '@/lib/utils/constants'

interface ProductFormProps {
  product?: Product
  onSubmit: (data: CreateProductRequest) => void
  onCancel: () => void
  isLoading?: boolean
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return null
    if (imagePath.startsWith('http')) return imagePath
    if (imagePath.startsWith('/uploads')) return `${API_BASE_URL}${imagePath}`
    return `${API_BASE_URL}/uploads/products/${imagePath}`
  }

  const [preview, setPreview] = useState<string | null>(product?.image ? getImageUrl(product.image) : null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateProductRequest>({
    defaultValues: product
      ? {
          name: product.name,
          slug: product.slug,
          description: product.description || '',
          price_per_kg: product.price_per_kg,
          stock_kg: product.stock_kg,
          is_active: product.is_active,
        }
      : {
          is_active: true,
        },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      // Validate file size (5MB)
      if (file.size > 20 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }
      setSelectedFile(file)
      setValue('image', file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setSelectedFile(null)
    setPreview(null)
    setValue('image', null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const onFormSubmit = (data: CreateProductRequest) => {
    onSubmit({
      ...data,
      image: selectedFile || data.image,
    })
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4" encType="multipart/form-data">
      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">Product Image</label>
        <div className="space-y-2">
          {preview ? (
            <div className="relative w-full h-48 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={preview}
                alt="Product preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
            >
              <Upload className="w-12 h-12 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Click to upload image</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {!preview && (
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              Select Image
            </Button>
          )}
        </div>
      </div>

      <Input
        label="Product Name"
        {...register('name', { required: 'Name is required' })}
        error={errors.name?.message}
      />

      <Input
        label="Slug"
        {...register('slug', { required: 'Slug is required' })}
        error={errors.slug?.message}
        placeholder="product-slug"
      />

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          {...register('description')}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Price per kg (₹)"
          type="number"
          step="0.01"
          {...register('price_per_kg', {
            required: 'Price is required',
            min: { value: 0, message: 'Price must be positive' },
          })}
          error={errors.price_per_kg?.message}
        />

        <Input
          label="Stock (kg)"
          type="number"
          step="0.01"
          {...register('stock_kg', {
            required: 'Stock is required',
            min: { value: 0, message: 'Stock must be positive' },
          })}
          error={errors.stock_kg?.message}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_active"
          {...register('is_active')}
          className="w-4 h-4 rounded"
        />
        <label htmlFor="is_active" className="text-sm">
          Active
        </label>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {product ? 'Update' : 'Create'} Product
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

