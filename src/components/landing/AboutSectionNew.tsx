'use client'

import React from 'react'
import Image from 'next/image'
import { Leaf, Award, Heart, Users, CheckCircle } from 'lucide-react'

const features = [
  {
    icon: Leaf,
    title: '100% Organic',
    description: 'Certified organic products, free from harmful pesticides and chemicals.',
  },
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'We source only the finest ingredients from trusted farmers.',
  },
  {
    icon: Heart,
    title: 'Healthy Living',
    description: 'Promoting wellness through natural, unprocessed food products.',
  },
  {
    icon: Users,
    title: 'Trusted Brand',
    description: 'Join thousands of satisfied customers who choose GV Natural.',
  },
]

const benefits = [
  'Direct from farm to your doorstep',
  'No artificial preservatives or additives',
  'Fair trade and sustainable sourcing',
  '100% money-back guarantee',
  'Free delivery on orders above ₹500',
  '24/7 customer support',
]

export const AboutSectionNew: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-white to-coffee-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-coffee-900 mb-4">
            Why Choose GV Natural?
          </h2>
          <p className="text-xl text-coffee-600 max-w-3xl mx-auto">
            We are committed to bringing you the finest organic products, 
            sourced directly from trusted farmers across India.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-coffee-100 group"
              >
                <div className="bg-gradient-to-br from-coffee-100 to-coffee-200 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-10 h-10 text-coffee-700" />
                </div>
                <h3 className="text-xl font-bold text-coffee-900 mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-coffee-600 text-center leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-3xl md:text-4xl font-bold text-coffee-900 mb-6">
              Our Commitment to Quality
            </h3>
            <p className="text-lg text-coffee-700 leading-relaxed">
              At GV Natural, we believe that what you eat matters. That's why we carefully 
              select each product in our range, ensuring it meets our high standards for 
              quality, freshness, and organic certification.
            </p>
            <p className="text-lg text-coffee-700 leading-relaxed">
              From our premium Gud (Jaggery) to our aromatic Desi Basmati Chawal, every 
              product is sourced from trusted farmers who share our commitment to quality 
              and sustainability.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-coffee-600 flex-shrink-0" />
                  <span className="text-coffee-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop&q=80"
                alt="Organic farming"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-coffee-900/60 to-transparent" />
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-coffee-200 rounded-full opacity-50 blur-2xl"></div>
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-coffee-300 rounded-full opacity-50 blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

