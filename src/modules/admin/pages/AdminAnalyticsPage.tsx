'use client'

import React from 'react'
import { Card } from '@/components/ui/Card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const revenueData = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 3000 },
  { month: 'Mar', revenue: 5000 },
  { month: 'Apr', revenue: 4500 },
  { month: 'May', revenue: 6000 },
  { month: 'Jun', revenue: 5500 },
]

const orderStatusData = [
  { name: 'Delivered', value: 45, color: '#22c55e' },
  { name: 'Shipped', value: 20, color: '#a855f7' },
  { name: 'Paid', value: 15, color: '#3b82f6' },
  { name: 'Created', value: 10, color: '#eab308' },
  { name: 'Cancelled', value: 10, color: '#ef4444' },
]

export default function AdminAnalyticsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Analytics & Reports</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <h2 className="text-xl font-bold mb-4">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h2 className="text-xl font-bold mb-4">Order Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-bold mb-4">Key Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
            <p className="text-2xl font-bold">₹28,500</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
            <p className="text-2xl font-bold">100</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Average Order Value</p>
            <p className="text-2xl font-bold">₹285</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</p>
            <p className="text-2xl font-bold">3.2%</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

