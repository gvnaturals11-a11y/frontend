'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Star } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Delhi',
    rating: 5,
    text: 'The fragrance of the Basmati rice took me back to my grandmother\'s kitchen. Absolutely authentic!',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80',
  },
  {
    id: 2,
    name: 'Rahul Verma',
    location: 'Punjab',
    rating: 5,
    text: 'Finally found genuine chemical-free Gur. My kids love it in their milk. Highly recommended!',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80',
  },
  {
    id: 3,
    name: 'Anita Desai',
    location: 'Mumbai',
    rating: 4,
    text: 'Fast delivery and the packaging was eco-friendly. The taste is distinctly different from store-bought sugar.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&q=80',
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
  hidden: (index: number) => ({ 
    opacity: 0, 
    y: 50,
    x: index % 2 === 0 ? -30 : 30,
  }),
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
}

export const TestimonialsSectionNew: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0.2)

  return (
    <section ref={ref} className="py-20 bg-coffee-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-coffee-800 mb-4">
            What Our Customers Say
          </h2>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              variants={cardVariants}
              custom={index}
              whileHover={{ 
                y: -10,
                scale: 1.05,
                transition: { type: 'spring', stiffness: 300, damping: 20 }
              }}
              className="relative bg-white rounded-xl shadow-md p-6 hover:shadow-2xl transition-all duration-300 group overflow-hidden"
            >
              {/* Animated Border */}
              <motion.div
                className="absolute inset-0 rounded-xl border-2 border-transparent"
                whileHover={{
                  borderColor: 'rgba(111, 78, 55, 0.3)',
                }}
                transition={{ duration: 0.3 }}
              />

              {/* Rating with Stagger Animation */}
              <motion.div
                className="flex gap-1 mb-4"
                initial="hidden"
                animate={isVisible ? 'visible' : 'hidden'}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: index * 0.2 + 0.3,
                    },
                  },
                }}
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={isVisible ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                    transition={{
                      delay: index * 0.2 + 0.3 + i * 0.1,
                      type: 'spring',
                      stiffness: 200,
                    }}
                  >
                    <Star
                      className={`w-5 h-5 ${
                        i < testimonial.rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* Quote with Fade In */}
              <motion.p
                className="text-coffee-700 italic mb-6 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: index * 0.2 + 0.5, duration: 0.6 }}
              >
                "{testimonial.text}"
              </motion.p>

              {/* Customer Info with Slide Animation */}
              <motion.div
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ delay: index * 0.2 + 0.7, duration: 0.6 }}
              >
                <motion.div
                  className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-coffee-200"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                    unoptimized
                  />
                </motion.div>
                <div>
                  <motion.div
                    className="font-bold text-coffee-900"
                    initial={{ opacity: 0 }}
                    animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: index * 0.2 + 0.8 }}
                  >
                    {testimonial.name}
                  </motion.div>
                  <motion.div
                    className="text-sm text-coffee-600"
                    initial={{ opacity: 0 }}
                    animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: index * 0.2 + 0.9 }}
                  >
                    {testimonial.location}
                  </motion.div>
                </div>
              </motion.div>

              {/* Shimmer Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-coffee-100/20 to-transparent"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

