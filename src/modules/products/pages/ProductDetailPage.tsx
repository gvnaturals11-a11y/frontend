'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { productsApi } from '@/lib/api/products.api'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ShoppingCart, Minus, Plus, Package, ArrowLeft } from 'lucide-react'
import { useCartStore } from '@/store/cart.store'
import { useAuthStore } from '@/store/auth.store'
import toast from 'react-hot-toast'
import { API_BASE_URL } from '@/lib/utils/constants'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((state) => state.addItem)
  const { isAuthenticated } = useAuthStore()

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const response = await productsApi.getById(productId)
      // API client interceptor returns response.data from axios
      // Backend returns: { statusCode: 200, status: "success", data: {...}, message: "..." }
      // After interceptor, response is the ApiResponse object
      // So we need to access response.data to get the product object
      
      // Check if response is ApiResponse format with data property
      if (response && typeof response === 'object' && 'data' in response) {
        const productData = (response as any).data
        // Check if data has _id (it's the product object)
        if (productData && typeof productData === 'object' && '_id' in productData) {
          return productData
        }
      }
      
      // Check if response is already a product object (old format)
      if (response && typeof response === 'object' && '_id' in response) {
        return response as any
      }
      
      return null
    },
    enabled: !!productId,
  })

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return null
    if (imagePath.startsWith('http')) return imagePath
    if (imagePath.startsWith('/uploads')) return `${API_BASE_URL}${imagePath}`
    return `${API_BASE_URL}/uploads/products/${imagePath}`
  }

  const handleAddToCart = () => {
    if (!product) return
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart')
      router.push('/login')
      return
    }
    
    addItem({
      product,
      quantity_kg: quantity,
    })
    toast.success(`${quantity}kg of ${product.name} added to cart!`)
  }

  const handleQuantityChange = (delta: number) => {
    if (!product) return
    const newQuantity = Math.max(1, Math.min(quantity + delta, product.stock_kg))
    setQuantity(newQuantity)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <p className="text-red-600 dark:text-red-400">
            Product not found or failed to load.
          </p>
        </Card>
      </div>
    )
  }

  const isOutOfStock = product.stock_kg <= 0

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden relative">
            {getImageUrl(product.image) ? (
              <Image
                src={getImageUrl(product.image)!}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                unoptimized
              />
            ) : (
              <Package className="w-32 h-32 text-gray-400" />
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-3xl font-bold text-primary mb-4">
              ₹{product.price_per_kg}/kg
            </p>
            {product.description && (
              <p className="text-coffee-600 mb-4">
                {product.description}
              </p>
            )}
            <p className={`text-sm ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
              {isOutOfStock ? 'Out of Stock' : `${product.stock_kg}kg available`}
            </p>
          </div>

          <Card>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Quantity (kg)</label>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-2xl font-semibold w-16 text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock_kg || isOutOfStock}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Total: ₹{(product.price_per_kg * quantity).toFixed(2)}
                </p>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                disabled={isOutOfStock || !product.is_active}
                className="w-full"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

