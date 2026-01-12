'use client'

import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { adminApi } from '@/lib/api/admin.api'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, MapPin, Phone, User, Package } from 'lucide-react'
import { OrderStatus } from '@/types/order.types'
import { cn } from '@/lib/utils/cn'
import toast from 'react-hot-toast'

const statusOptions: OrderStatus[] = ['CREATED', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']

const statusColors: Record<OrderStatus, string> = {
  CREATED: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  PAID: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  SHIPPED: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  DELIVERED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}

export default function AdminOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  const queryClient = useQueryClient()

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['admin', 'order', orderId],
    queryFn: async () => {
      const response = await adminApi.getOrderById(orderId)
      return response.data
    },
    enabled: !!orderId,
  })

  const updateStatusMutation = useMutation({
    mutationFn: (status: string) => adminApi.updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'order', orderId] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] })
      toast.success('Order status updated!')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update status')
    },
  })

  if (isLoading) {
    return (
      <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
    )
  }

  if (error || !order) {
    return (
      <Card>
        <p className="text-red-600 dark:text-red-400">
          Order not found or failed to load.
        </p>
      </Card>
    )
  }

  const statusColor = statusColors[order.status as OrderStatus] || statusColors.CREATED

  return (
    <div>
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-2xl font-bold mb-4">Order Details</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Order Number</span>
                <span className="font-semibold">#{order.order_number}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Status</span>
                <div className="flex items-center gap-4">
                  <span className={cn('px-3 py-1 rounded-full text-sm font-medium', statusColor)}>
                    {order.status}
                  </span>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatusMutation.mutate(e.target.value)}
                    className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-800"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Date</span>
                <span>
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'N/A'}
                </span>
              </div>
              {order.payment_method && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Payment Method</span>
                  <span className="font-semibold">
                    {order.payment_method === 'COD' ? (
                      <span className="text-orange-600 dark:text-orange-400">Cash on Delivery</span>
                    ) : (
                      <span className="text-green-600 dark:text-green-400">Prepaid</span>
                    )}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-4 border-t">
                <span>Total Amount</span>
                <span>₹{order.subtotal.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          {order.shipping_address && (
            <Card>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Shipping Address
              </h2>
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  {order.shipping_address.name}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {order.shipping_address.phone}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {order.shipping_address.address_line1}
                </p>
                {order.shipping_address.address_line2 && (
                  <p className="text-gray-600 dark:text-gray-400">
                    {order.shipping_address.address_line2}
                  </p>
                )}
                <p className="text-gray-600 dark:text-gray-400">
                  {order.shipping_address.city}, {order.shipping_address.state} -{' '}
                  {order.shipping_address.pincode}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {order.shipping_address.country}
                </p>
              </div>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card>
            <h2 className="text-xl font-bold mb-4">Order Items</h2>
            {order.items && order.items.length > 0 ? (
              <div className="space-y-3">
                {order.items.map((item: any, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Package className="w-8 h-8 text-gray-400" />
                    <div className="flex-1">
                      <p className="font-medium">Item {index + 1}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.quantity_kg}kg @ ₹{item.price_per_kg || 0}/kg
                      </p>
                    </div>
                    <p className="font-semibold">
                      ₹{((item.price_per_kg || 0) * item.quantity_kg).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No items found</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

