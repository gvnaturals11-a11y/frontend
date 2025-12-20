'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ArrowRight, CheckCircle, Star } from 'lucide-react'
import { Button } from '../ui/Button'
import Link from 'next/link'
import { useTypewriter } from '@/hooks/useTypewriter'

export const HeroSection: React.FC = () => {
  const [currentImage, setCurrentImage] = useState(0)
  const [showCursor, setShowCursor] = useState(true)
  
  const images = [
    'https://images.unsplash.com/photo-1615485925505-c7c5f5ba8597?w=1200&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1200&h=800&fit=crop&q=80',
    'https://images.unsplash.com/photo-1615485500705-46531b57e0a9?w=1200&h=800&fit=crop&q=80',
  ]

  // Typewriter texts - sequential
  const displayTexts = useTypewriter(['Premium Organic', 'Products for', 'Healthy Living'], 80)
  const text1 = displayTexts[0] || ''
  const text2 = displayTexts[1] || ''
  const text3 = displayTexts[2] || ''

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  // Cursor blink effect
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 530)
    return () => clearInterval(cursorTimer)
  }, [])

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-coffee-50 via-white to-coffee-100">

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-coffee-100 rounded-full text-coffee-700 font-medium text-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Star className="w-4 h-4 fill-coffee-600" />
              </motion.div>
              <span>100% Organic & Natural Products</span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-coffee-900 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.span
                className="block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {text1}
                {text1.length < 'Premium Organic'.length && (
                  <motion.span
                    animate={{ opacity: showCursor ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="inline-block w-1 h-12 md:h-16 lg:h-20 bg-coffee-600 ml-2 align-middle"
                  />
                )}
              </motion.span>
              <motion.span
                className="block text-coffee-600 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: text1.length === 'Premium Organic'.length ? 1 : 0 }}
                transition={{ delay: 0.2 }}
              >
                {text2}
                {text1.length === 'Premium Organic'.length && text2.length < 'Products for'.length && (
                  <motion.span
                    animate={{ opacity: showCursor ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="inline-block w-1 h-12 md:h-16 lg:h-20 bg-coffee-600 ml-2 align-middle"
                  />
                )}
              </motion.span>
              <motion.span
                className="block text-coffee-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: text2.length === 'Products for'.length ? 1 : 0 }}
                transition={{ delay: 0.2 }}
              >
                {text3}
                {text2.length === 'Products for'.length && text3.length < 'Healthy Living'.length && (
                  <motion.span
                    animate={{ opacity: showCursor ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="inline-block w-1 h-12 md:h-16 lg:h-20 bg-coffee-600 ml-2 align-middle"
                  />
                )}
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-xl text-coffee-700 leading-relaxed max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              Discover the finest organic Gud, Shakkar, Chini, and Desi Basmati Chawal.{' '}
              Sourced directly from trusted farmers, delivered fresh to your doorstep.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.3 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/products">
                  <Button
                    size="lg"
                    className="bg-coffee-600 hover:bg-coffee-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2"
                  >
                    Shop Now
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="#about">
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-4 text-lg font-semibold border-2 border-coffee-600 text-coffee-700 hover:bg-coffee-50"
                  >
                    Learn More
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="flex flex-wrap gap-6 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.5 }}
            >
              {[
                { icon: CheckCircle, text: 'Certified Organic' },
                { icon: CheckCircle, text: 'Farm Fresh' },
                { icon: CheckCircle, text: 'Free Delivery' },
              ].map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={index}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1.7 + index * 0.1 }}
                    whileHover={{ scale: 1.1, x: 5 }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                    >
                      <Icon className="w-5 h-5 text-coffee-600" />
                    </motion.div>
                    <span className="text-coffee-700 font-medium">{item.text}</span>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>

          {/* Right Image Slider */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative h-[500px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
              <AnimatePresence mode="wait">
                {images.map((img, index) => (
                  index === currentImage && (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.8 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={img}
                        alt={`Product ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                        priority={index === 0}
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-coffee-900/40 to-transparent" />
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
              
              {/* Image Indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {images.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`h-2 rounded-full ${
                      index === currentImage
                        ? 'bg-white'
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    animate={{
                      width: index === currentImage ? 32 : 8,
                    }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </div>
            </div>

            {/* Floating Cards */}
            <motion.div
              className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-coffee-200 hidden md:block"
              initial={{ opacity: 0, y: 20, rotate: -5 }}
              animate={{ 
                opacity: 1, 
                y: [0, -10, 0],
                rotate: [-5, 0, -5],
              }}
              transition={{ 
                y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
                rotate: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                opacity: { duration: 0.8, delay: 1 },
              }}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-12 h-12 bg-coffee-100 rounded-full flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  <Star className="w-6 h-6 text-coffee-600 fill-coffee-600" />
                </motion.div>
                <div>
                  <p className="font-bold text-coffee-900">4.9/5 Rating</p>
                  <p className="text-sm text-coffee-600">500+ Reviews</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-xl border border-coffee-200 hidden md:block"
              initial={{ opacity: 0, y: -20, rotate: 5 }}
              animate={{ 
                opacity: 1, 
                y: [0, 10, 0],
                rotate: [5, 0, 5],
              }}
              transition={{ 
                y: { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.5 },
                rotate: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.5 },
                opacity: { duration: 0.8, delay: 1.2 },
              }}
              whileHover={{ scale: 1.1, rotate: -5 }}
            >
              <div className="text-center">
                <motion.p
                  className="text-2xl font-bold text-coffee-600"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  10K+
                </motion.p>
                <p className="text-sm text-coffee-600">Happy Customers</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

