'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types/product.types'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ShoppingCart, Package } from 'lucide-react'
import { useCartStore } from '@/store/cart.store'
import { useAuthStore } from '@/store/auth.store'
import toast from 'react-hot-toast'
import { API_BASE_URL } from '@/lib/utils/constants'

interface ProductCardProps {
  product: Product
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter()
  const addItem = useCartStore((state) => state.addItem)
  const { isAuthenticated } = useAuthStore()

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return null
    if (imagePath.startsWith('http')) return imagePath
    if (imagePath.startsWith('/uploads')) return `${API_BASE_URL}${imagePath}`
    return `${API_BASE_URL}/uploads/products/${imagePath}`
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart')
      router.push('/login')
      return
    }
    
    addItem({
      product,
      quantity_kg: 1,
    })
    toast.success(`${product.name} added to cart!`)
  }

  const isOutOfStock = product.stock_kg <= 0
  const imageUrl = getImageUrl(product.image)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card hover className="h-full flex flex-col">
        <Link href={`/products/${product._id}`} className="block">
          <div className="aspect-square bg-coffee-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden relative">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                unoptimized
              />
            ) : (
              <Package className="w-16 h-16 text-coffee-400" />
            )}
          </div>
        </Link>

        <div className="flex-1 flex flex-col">
          <Link href={`/products/${product._id}`} className="block">
            <h3 className="text-xl font-semibold mb-2 text-coffee-900 hover:text-coffee-700 transition-colors">
              {product.name}
            </h3>
          </Link>
          
          {product.description && (
            <p className="text-sm text-coffee-600 mb-4 line-clamp-2">
              {product.description}
            </p>
          )}

          <div className="mt-auto space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-primary">
                ₹{product.price_per_kg}/kg
              </span>
              <span className={`text-sm ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
                {isOutOfStock ? 'Out of Stock' : `${product.stock_kg}kg available`}
              </span>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={handleAddToCart}
              disabled={isOutOfStock || !product.is_active}
              className="w-full"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

