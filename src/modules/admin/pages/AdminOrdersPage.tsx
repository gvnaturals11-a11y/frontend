'use client'

import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@/lib/api/admin.api'
import { Order, OrderStatus } from '@/types/order.types'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Package, Eye } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import Link from 'next/link'
import toast from 'react-hot-toast'

const statusOptions: OrderStatus[] = ['CREATED', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']

const statusColors: Record<OrderStatus, string> = {
  CREATED: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  PAID: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  SHIPPED: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  DELIVERED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}

export default function AdminOrdersPage() {
  const queryClient = useQueryClient()

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: async () => {
      const response = await adminApi.getAllOrders()
      // Handle response format: { statusCode, status, data: Order[], message }
      if (response && response.data && Array.isArray(response.data)) {
        return response.data
      }
      // Fallback: if response is directly an array
      if (Array.isArray(response)) {
        return response
      }
      return []
    },
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminApi.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] })
      toast.success('Order status updated!')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update status')
    },
  })

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateStatusMutation.mutate({ id: orderId, status: newStatus })
  }

  const getUserName = (order: any) => {
    if (order.user_id && typeof order.user_id === 'object') {
      return order.user_id.name || 'N/A'
    }
    return 'N/A'
  }

  const getUserPhone = (order: any) => {
    if (order.user_id && typeof order.user_id === 'object') {
      return order.user_id.phone || 'N/A'
    }
    return 'N/A'
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Orders Management</h1>

      {isLoading ? (
        <Card>
          <div className="p-8">
            <div className="animate-pulse space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
              ))}
            </div>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Order #</th>
                  <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Customer</th>
                  <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Phone</th>
                  <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Date</th>
                  <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Amount</th>
                  <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders && orders.length > 0 ? (
                  orders.map((order: any) => (
                    <tr
                      key={order._id}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <td className="p-4">
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                          #{order.order_number}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-gray-900 dark:text-gray-100">
                          {getUserName(order)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {getUserPhone(order)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })
                            : 'N/A'}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                          ₹{order.subtotal?.toFixed(2) || '0.00'}
                        </div>
                      </td>
                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={cn(
                            'px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer',
                            statusColors[order.status as OrderStatus]
                          )}
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4">
                        <Link href={`/admin/orders/${order._id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500 dark:text-gray-400">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}

