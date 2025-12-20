'use client'

import React from 'react'
import Image from 'next/image'
import { Package, ShoppingBag, Sparkles, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/Button'

const categories = [
  {
    icon: Package,
    title: 'Premium Gud',
    description: '100% Natural Jaggery - Unrefined & Nutrient Rich',
    image: 'https://images.unsplash.com/photo-1615485925505-c7c5f5ba8597?w=600&h=400&fit=crop&q=80',
    link: '/products?category=gud',
    color: 'from-amber-100 to-orange-100',
  },
  {
    icon: ShoppingBag,
    title: 'Desi Basmati Chawal',
    description: 'Authentic Long Grain Rice - Aromatic & Fresh',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=400&fit=crop&q=80',
    link: '/products?category=chawal',
    color: 'from-yellow-100 to-amber-100',
  },
  {
    icon: Sparkles,
    title: 'Natural Shakkar',
    description: 'Pure Cane Sugar - No Additives, Just Sweetness',
    image: 'https://images.unsplash.com/photo-1615485500705-46531b57e0a9?w=600&h=400&fit=crop&q=80',
    link: '/products?category=shakkar',
    color: 'from-coffee-100 to-amber-100',
  },
  {
    icon: TrendingUp,
    title: 'Premium Chini',
    description: 'Refined Sugar - Perfect for Every Kitchen',
    image: 'https://images.unsplash.com/photo-1615485500705-46531b57e0a9?w=600&h=400&fit=crop&q=80',
    link: '/products?category=chini',
    color: 'from-stone-100 to-coffee-100',
  },
]

export const ProductShowcase: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-coffee-900 mb-4">
            Our Premium Collection
          </h2>
          <p className="text-xl text-coffee-600 max-w-2xl mx-auto">
            Handpicked organic products, sourced directly from trusted farmers
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <Link
                key={index}
                href={category.link}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${category.color} p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2`}
              >
                <div className="relative h-48 mb-4 rounded-xl overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-coffee-900/60 to-transparent" />
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-coffee-600 p-2 rounded-lg">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-coffee-900">{category.title}</h3>
                  </div>
                  <p className="text-coffee-700 text-sm mb-4">{category.description}</p>
                  <div className="flex items-center text-coffee-600 font-semibold group-hover:text-coffee-700 transition-colors">
                    Shop Now
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="text-center">
          <Link href="/products">
            <Button
              size="lg"
              variant="outline"
              className="px-10 py-4 text-lg font-semibold border-2 border-coffee-600 text-coffee-700 hover:bg-coffee-50"
            >
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

