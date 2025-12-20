'use client'

import React from 'react'
import { Leaf, Award, Heart, Users } from 'lucide-react'

const features = [
  {
    icon: Leaf,
    title: '100% Organic',
    description: 'All our products are certified organic, grown without harmful pesticides or chemicals.',
  },
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'We source only the finest ingredients to ensure the best quality for our customers.',
  },
  {
    icon: Heart,
    title: 'Healthy Living',
    description: 'Promoting a healthy lifestyle with natural, unprocessed food products.',
  },
  {
    icon: Users,
    title: 'Trusted by Thousands',
    description: 'Join thousands of satisfied customers who trust GV Natural for their daily needs.',
  },
]

export const AboutSection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-coffee-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-coffee-800 mb-4">
            About GV Natural
          </h2>
          <p className="text-xl text-coffee-600 max-w-3xl mx-auto">
            We are committed to bringing you the finest organic products, sourced directly from trusted farmers.
            Our mission is to promote healthy living through natural, unprocessed food.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-coffee-100"
              >
                <div className="bg-coffee-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Icon className="w-8 h-8 text-coffee-700" />
                </div>
                <h3 className="text-xl font-semibold text-coffee-800 mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-coffee-600 text-center">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-coffee-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold text-coffee-800 mb-4">
                Our Story
              </h3>
              <p className="text-coffee-700 mb-4 leading-relaxed">
                GV Natural was founded with a simple mission: to make organic, natural products
                accessible to everyone. We believe that what you eat matters, and that's why we
                carefully select each product in our range.
              </p>
              <p className="text-coffee-700 leading-relaxed">
                From our premium Gud (Jaggery) to our aromatic Desi Basmati Chawal, every product
                is sourced from trusted farmers who share our commitment to quality and sustainability.
                We're not just selling products; we're promoting a healthier, more natural way of life.
              </p>
            </div>
            <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: 'url(https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop)',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-coffee-900/50 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

