'use client'

import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../ui/Button'
import Link from 'next/link'

const slides = [
  {
    id: 1,
    title: 'Premium Organic Gud',
    description: '100% Natural Jaggery - Pure, Unrefined, and Full of Nutrients',
    image: 'https://images.unsplash.com/photo-1615485925505-c7c5f5ba8597?w=1200&h=600&fit=crop',
    cta: 'Shop Now',
    link: '/products?category=gud',
  },
  {
    id: 2,
    title: 'Desi Basmati Chawal',
    description: 'Authentic Long Grain Basmati Rice - Farm Fresh & Aromatic',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1200&h=600&fit=crop',
    cta: 'Explore',
    link: '/products?category=chawal',
  },
  {
    id: 3,
    title: 'Natural Shakkar & Chini',
    description: 'Pure Cane Sugar - No Additives, Just Natural Sweetness',
    image: 'https://images.unsplash.com/photo-1615485500705-46531b57e0a9?w=1200&h=600&fit=crop',
    cta: 'Discover',
    link: '/products',
  },
]

export const HeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  return (
    <div className="relative h-[600px] md:h-[700px] overflow-hidden rounded-2xl shadow-2xl">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-coffee-900/80 to-coffee-800/60" />
          </div>
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4 md:px-8">
              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl text-coffee-100 mb-8 animate-fade-in">
                  {slide.description}
                </p>
                <Link href={slide.link}>
                  <Button
                    size="lg"
                    className="bg-coffee-600 hover:bg-coffee-700 text-white px-8 py-4 text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    {slide.cta}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

