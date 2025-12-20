'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { ordersApi } from '@/lib/api/orders.api'
import { OrderCard } from '../components/OrderCard'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Package, ShoppingBag } from 'lucide-react'

export default function OrdersPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  const { data, isLoading, error } = useQuery({
    queryKey: ['orders', 'my'],
    queryFn: async () => {
      const response = await ordersApi.getMyOrders()
      // API client interceptor returns response.data from axios
      // Backend returns: { statusCode: 200, status: "success", data: [...], message: "..." }
      // After interceptor, response is the ApiResponse object
      // So we need to access response.data to get the orders array
      
      // Check if response is already an array (old format - direct array)
      if (Array.isArray(response)) {
        return response
      }
      
      // Check if response is ApiResponse format with data property
      if (response && typeof response === 'object' && 'data' in response) {
        const orders = (response as any).data
        if (Array.isArray(orders)) {
          return orders
        }
      }
      
      return []
    },
    enabled: isAuthenticated,
  })

  if (!isAuthenticated) {
    return null
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-coffee-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <p className="text-red-600">
            Failed to load orders. Please try again.
          </p>
        </Card>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="text-center py-12">
          <Package className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
          <p className="text-coffee-600 mb-6">
            Start shopping to see your orders here!
          </p>
          <Button variant="primary" onClick={() => router.push('/products')}>
            <ShoppingBag className="w-4 h-4 mr-2" />
            Browse Products
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      <div className="space-y-4">
        {data.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>
    </div>
  )
}

