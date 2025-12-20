'use client'

import React, { useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

const countUp = (end: number, duration: number, setValue: (val: number) => void) => {
  let start = 0
  const increment = end / (duration / 16)
  const timer = setInterval(() => {
    start += increment
    if (start >= end) {
      setValue(end)
      clearInterval(timer)
    } else {
      setValue(Math.floor(start))
    }
  }, 16)
}

export const HeritageSection: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0.2)
  const [count100, setCount100] = useState(0)
  const [count500, setCount500] = useState(0)
  const [count5k, setCount5k] = useState(0)

  useEffect(() => {
    if (isVisible) {
      countUp(100, 2000, setCount100)
      countUp(500, 2000, setCount500)
      countUp(5000, 2000, setCount5k)
    }
  }, [isVisible])

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-white to-coffee-50 relative overflow-hidden">

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-green-600 text-sm font-semibold uppercase tracking-wide mb-4"
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6 }}
          >
            OUR HERITAGE
          </motion.div>

          {/* Main Title with Typewriter Effect */}
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.span
              className="text-coffee-800"
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              The Taste of{' '}
            </motion.span>
            <motion.span
              className="text-amber-500 inline-block"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{
                duration: 0.6,
                delay: 0.6,
                type: 'spring',
                stiffness: 200,
              }}
            >
              Authentic
            </motion.span>
            <motion.span
              className="text-coffee-800"
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              {' '}India
            </motion.span>
          </motion.h2>

          {/* Body Text with Stagger */}
          <motion.div
            className="space-y-6 mb-12"
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                  delayChildren: 0.3,
                },
              },
            }}
          >
            <motion.p
              className="text-lg text-coffee-700 leading-relaxed"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              In a world of refined sugars and polished grains, we bring you back to the roots.{' '}
              GV Natural was born from a desire to preserve the traditional farming methods of Northern India.
            </motion.p>
            <motion.p
              className="text-lg text-coffee-700 leading-relaxed"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              Our <strong className="text-coffee-900">Sakkad Gur Khand</strong> is not just sugar; it's a mineral-rich superfood.{' '}
              Our <strong className="text-coffee-900">Desi Basmati</strong> isn't just rice; it's a fragrant legacy passed down through generations.{' '}
              We bridge the gap between the hardworking farmer and your dining table.
            </motion.p>
          </motion.div>

          {/* Statistics with Count Up Animation */}
          <motion.div
            className="grid grid-cols-3 gap-8 pt-8 border-t border-coffee-200"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.div
              className="text-center"
              whileHover={{ scale: 1.1, y: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <motion.div
                className="text-5xl font-bold text-coffee-800 mb-2"
                initial={{ scale: 0 }}
                animate={isVisible ? { scale: 1 } : { scale: 0 }}
                transition={{ type: 'spring', stiffness: 200, delay: 1 }}
              >
                {count100}%
              </motion.div>
              <div className="text-coffee-600 text-sm">Natural</div>
            </motion.div>
            <motion.div
              className="text-center border-l border-r border-coffee-200"
              whileHover={{ scale: 1.1, y: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <motion.div
                className="text-5xl font-bold text-coffee-800 mb-2"
                initial={{ scale: 0 }}
                animate={isVisible ? { scale: 1 } : { scale: 0 }}
                transition={{ type: 'spring', stiffness: 200, delay: 1.2 }}
              >
                {count500}+
              </motion.div>
              <div className="text-coffee-600 text-sm">Farmers</div>
            </motion.div>
            <motion.div
              className="text-center"
              whileHover={{ scale: 1.1, y: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <motion.div
                className="text-5xl font-bold text-coffee-800 mb-2"
                initial={{ scale: 0 }}
                animate={isVisible ? { scale: 1 } : { scale: 0 }}
                transition={{ type: 'spring', stiffness: 200, delay: 1.4 }}
              >
                {count5k}+
              </motion.div>
              <div className="text-coffee-600 text-sm">Customers</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

