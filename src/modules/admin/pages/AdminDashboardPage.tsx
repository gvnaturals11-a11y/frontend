'use client'

import React from 'react'
import { Card } from '@/components/ui/Card'
import { Package, ShoppingBag, Users, DollarSign } from 'lucide-react'

const stats = [
  { label: 'Total Products', value: '0', icon: Package, color: 'text-blue-600' },
  { label: 'Total Orders', value: '0', icon: ShoppingBag, color: 'text-green-600' },
  { label: 'Total Users', value: '0', icon: Users, color: 'text-purple-600' },
  { label: 'Total Revenue', value: '₹0', icon: DollarSign, color: 'text-orange-600' },
]

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} hover>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <Icon className={`w-12 h-12 ${stat.color}`} />
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          <p className="text-gray-600 dark:text-gray-400">
            No orders yet. Orders will appear here.
          </p>
        </Card>

        <Card>
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              Add New Product
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              View All Orders
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              Manage Users
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}

