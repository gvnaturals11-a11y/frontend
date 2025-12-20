'use client'

import React from 'react'
import { Users, Package, Award, Heart } from 'lucide-react'

const stats = [
  {
    icon: Users,
    value: '10,000+',
    label: 'Happy Customers',
    color: 'text-coffee-600',
    bgColor: 'bg-coffee-100',
  },
  {
    icon: Package,
    value: '50+',
    label: 'Premium Products',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
  },
  {
    icon: Award,
    value: '100%',
    label: 'Organic Certified',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    icon: Heart,
    value: '4.9/5',
    label: 'Customer Rating',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
]

export const StatsSection: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-coffee-600 to-coffee-800 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className="text-center transform hover:scale-105 transition-transform duration-300"
              >
                <div className={`${stat.bgColor} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-coffee-200 text-sm md:text-base">{stat.label}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

