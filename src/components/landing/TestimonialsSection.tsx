'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    text: 'The quality of Gud I received was exceptional! Pure, natural, and exactly as described. GV Natural has become my go-to for all organic products.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80',
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    location: 'Delhi',
    rating: 5,
    text: 'Best Basmati Chawal I have ever tasted! The aroma and quality are unmatched. Highly recommend GV Natural to everyone.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80',
  },
  {
    id: 3,
    name: 'Anita Patel',
    location: 'Ahmedabad',
    rating: 5,
    text: 'Amazing service and premium quality products. The Shakkar is so pure and natural. Thank you GV Natural for bringing us such authentic products!',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&q=80',
  },
  {
    id: 4,
    name: 'Vikram Singh',
    location: 'Pune',
    rating: 5,
    text: 'I have been ordering from GV Natural for the past 6 months. Consistent quality, fast delivery, and excellent customer service. 5 stars!',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&q=80',
  },
]

export const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-coffee-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-coffee-600 max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="relative bg-gradient-to-br from-coffee-50 to-coffee-100 rounded-3xl p-8 md:p-12 shadow-xl">
            <Quote className="w-12 h-12 text-coffee-300 mb-4" />
            
            <div className="relative h-64 overflow-hidden">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === currentIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 text-amber-400 fill-amber-400"
                        />
                      ))}
                    </div>
                    <p className="text-lg md:text-xl text-coffee-800 mb-6 leading-relaxed italic">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-coffee-900">{testimonial.name}</div>
                        <div className="text-sm text-coffee-600">{testimonial.location}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 text-coffee-700 hover:text-coffee-900"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 text-coffee-700 hover:text-coffee-900"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-8 bg-coffee-600'
                      : 'w-2 bg-coffee-300 hover:bg-coffee-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

