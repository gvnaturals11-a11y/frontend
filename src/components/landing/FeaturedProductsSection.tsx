'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { productsApi } from '@/lib/api/products.api'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { API_BASE_URL } from '@/lib/utils/constants'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
}

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
}

export const FeaturedProductsSection: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0.2)

  const { data: products, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const response = await productsApi.getAll()
      // API client interceptor returns response.data from axios
      // Backend returns: { statusCode: 200, status: "success", data: [...], message: "..." }
      // After interceptor, response is the ApiResponse object
      // So we need to access response.data to get the products array
      
      // Check if response is already an array (old format - direct array)
      if (Array.isArray(response)) {
        return response
      }
      
      // Check if response is ApiResponse format with data property
      if (response && typeof response === 'object' && 'data' in response) {
        const products = (response as any).data
        if (Array.isArray(products)) {
          return products
        }
      }
      
      return []
    },
  })

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return null
    if (imagePath.startsWith('http')) return imagePath
    if (imagePath.startsWith('/uploads')) return `${API_BASE_URL}${imagePath}`
    return `${API_BASE_URL}/uploads/products/${imagePath}`
  }

  // Get first 2 active products as featured
  const featuredProducts = React.useMemo(() => {
    if (!products || products.length === 0) return []
    const activeProducts = products.filter((p: any) => p.is_active && p.stock_kg > 0)
    return activeProducts.slice(0, 2).map((product: any, index: number) => ({
      id: product._id,
      name: product.name,
      badge: index === 0 ? 'BEST SELLER' : 'PREMIUM',
      badgeColor: index === 0 ? 'bg-green-500' : 'bg-amber-500',
      image: getImageUrl(product.image) || 'https://images.unsplash.com/photo-1615485925505-c7c5f5ba8597?w=600&h=400&fit=crop&q=80',
      link: `/products/${product._id}`,
      product,
    }))
  }, [products])

  if (isLoading) {
    return (
      <section ref={ref} className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-12 bg-gray-200 rounded w-96 mx-auto animate-pulse" />
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[1, 2].map((i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (featuredProducts.length === 0) {
    return null
  }

  return (
    <section ref={ref} className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="text-amber-600 text-sm font-semibold uppercase tracking-wide mb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            OUR HARVEST
          </motion.div>
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-coffee-800"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, delay: 0.3, type: 'spring' }}
          >
            Featured Products
          </motion.h2>
        </motion.div>

        {/* Product Cards */}
        <motion.div
          className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
        >
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              variants={cardVariants}
              whileHover={{ 
                y: -15,
                scale: 1.02,
                transition: { type: 'spring', stiffness: 300, damping: 20 }
              }}
              className="relative group"
            >
              <Link href={product.link} className="block">
                <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
                  {/* Animated Border */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-transparent"
                    whileHover={{
                      borderColor: 'rgba(111, 78, 55, 0.5)',
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Pulsing Badge */}
                  <motion.div
                    className={`absolute top-4 right-4 ${product.badgeColor} text-white px-4 py-2 rounded-full text-sm font-semibold z-10`}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={isVisible ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                    transition={{ 
                      delay: index * 0.2 + 0.5,
                      type: 'spring',
                      stiffness: 200,
                    }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {product.badge}
                  </motion.div>

                  {/* Product Name with Slide Animation */}
                  <motion.div
                    className="absolute top-4 left-4 z-10"
                    initial={{ opacity: 0, x: -30 }}
                    animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                    transition={{ delay: index * 0.2 + 0.7, duration: 0.6 }}
                  >
                    <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                      {product.name}
                    </h3>
                  </motion.div>

                  {/* Image with Parallax Effect */}
                  <div className="relative h-80 w-full overflow-hidden">
                    <motion.div
                      whileHover={{ scale: 1.15 }}
                      transition={{ duration: 0.5 }}
                      className="relative w-full h-full"
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                        unoptimized
                      />
                    </motion.div>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-coffee-900/60 to-transparent"
                      initial={{ opacity: 0.6 }}
                      whileHover={{ opacity: 0.4 }}
                    />
                    
                    {/* Shimmer Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

