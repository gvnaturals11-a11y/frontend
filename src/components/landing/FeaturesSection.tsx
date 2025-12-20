'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Leaf, UtensilsCrossed, Truck } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const features = [
  {
    icon: Leaf,
    title: '100% Organic',
    description: 'Grown without harmful pesticides or synthetic fertilizers. Pure nature on your plate.',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    icon: UtensilsCrossed,
    title: 'Traditionally Made',
    description: 'Our Gur is processed using age-old techniques to retain all natural minerals and vitamins.',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
  },
  {
    icon: Truck,
    title: 'Farm to Fork',
    description: 'Directly sourced from farmers, ensuring freshness and fair prices for the growers.',
    iconBg: 'bg-coffee-100',
    iconColor: 'text-coffee-700',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
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

export const FeaturesSection: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0.1)

  return (
    <section ref={ref} className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ 
                  y: -10,
                  scale: 1.05,
                  transition: { type: 'spring', stiffness: 300, damping: 20 }
                }}
                className="relative bg-white rounded-xl shadow-md p-8 hover:shadow-2xl transition-all duration-300 group overflow-hidden"
              >
                {/* Animated Border */}
                <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-coffee-400 transition-all duration-500"></div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-coffee-200 via-amber-200 to-coffee-200 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                
                {/* Icon with Animation */}
                <motion.div
                  className={`${feature.iconBg} w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto relative`}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Icon className={`w-8 h-8 ${feature.iconColor} relative z-10`} />
                  <motion.div
                    className={`absolute inset-0 ${feature.iconBg} rounded-full`}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                </motion.div>

                {/* Title with Typewriter Effect */}
                <motion.h3
                  className="text-xl font-bold text-coffee-800 mb-4 text-center"
                  initial={{ opacity: 0 }}
                  animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: index * 0.2 + 0.3, duration: 0.5 }}
                >
                  {feature.title}
                </motion.h3>

                {/* Description */}
                <motion.p
                  className="text-coffee-600 text-center leading-relaxed"
                  initial={{ opacity: 0, y: 10 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ delay: index * 0.2 + 0.5, duration: 0.5 }}
                >
                  {feature.description}
                </motion.p>

                {/* Shimmer Effect on Hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

