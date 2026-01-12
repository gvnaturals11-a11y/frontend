'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { ordersApi } from '@/lib/api/orders.api'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Package, MapPin, Phone, User, Image as ImageIcon } from 'lucide-react'
import { ShipmentTracking } from '../components/ShipmentTracking'
import { OrderStatus } from '@/types/order.types'
import { cn } from '@/lib/utils/cn'
import { API_BASE_URL } from '@/lib/utils/constants'

const statusColors: Record<OrderStatus, string> = {
  CREATED: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  PAID: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  SHIPPED: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  DELIVERED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}

const getStatusLabel = (status: OrderStatus): string => {
  const labels: Record<OrderStatus, string> = {
    CREATED: 'ORDERED',
    PAID: 'PAID',
    SHIPPED: 'SHIPPED',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED',
  }
  return labels[status] || status
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const response = await ordersApi.getById(orderId)
      // API client interceptor returns response.data from axios
      // Backend returns: { statusCode: 200, status: "success", data: {...}, message: "..." }
      // After interceptor, response is the ApiResponse object
      // So we need to access response.data to get the order object
      
      // Check if response is ApiResponse format with data property
      if (response && typeof response === 'object' && 'data' in response) {
        const orderData = (response as any).data
        // Check if data has _id (it's the order object)
        if (orderData && typeof orderData === 'object' && '_id' in orderData) {
          return orderData
        }
      }
      
      // Check if response is already an order object (old format)
      if (response && typeof response === 'object' && '_id' in response) {
        return response as any
      }
      
      return null
    },
    enabled: !!orderId,
  })

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return null
    if (imagePath.startsWith('http')) return imagePath
    if (imagePath.startsWith('/uploads')) return `${API_BASE_URL}${imagePath}`
    return `${API_BASE_URL}/uploads/products/${imagePath}`
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <p className="text-red-600 dark:text-red-400">
            Order not found or failed to load.
          </p>
        </Card>
      </div>
    )
  }

  const statusColor = statusColors[order.status as OrderStatus] || statusColors.CREATED

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items - Moved to top for better visibility */}
          <Card>
            <h2 className="text-2xl font-bold mb-4">Order Items</h2>
            {order.items && Array.isArray(order.items) && order.items.length > 0 ? (
              <div className="space-y-4">
                {order.items.map((item: any, index: number) => {
                  const product = typeof item.product_id === 'object' ? item.product_id : null
                  const productId = product?._id || item.product_id || ''
                  const productName = product?.name || `Product ${index + 1}`
                  const productImage = product?.image
                  const quantity = item.quantity_kg || 0
                  const pricePerKg = item.price_per_kg || 0
                  const itemTotal = pricePerKg * quantity
                  const imageUrl = getImageUrl(productImage)

                  return (
                    <div key={item._id || index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                      <div className="flex gap-4">
                        {imageUrl ? (
                          <Link 
                            href={`/products/${productId}`}
                            className="flex-shrink-0"
                          >
                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-coffee-100 dark:bg-coffee-900/20 relative">
                              <Image
                                src={imageUrl}
                                alt={productName}
                                fill
                                sizes="80px"
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                          </Link>
                        ) : (
                          <div className="w-20 h-20 rounded-lg bg-coffee-100 dark:bg-coffee-900/20 flex items-center justify-center flex-shrink-0">
                            <ImageIcon className="w-10 h-10 text-coffee-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <Link 
                            href={`/products/${productId}`}
                            className="block"
                          >
                            <h3 className="font-semibold text-lg text-coffee-900 dark:text-coffee-100 hover:text-coffee-700 dark:hover:text-coffee-300 transition-colors line-clamp-2">
                              {productName}
                            </h3>
                          </Link>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm text-coffee-600 dark:text-coffee-400">
                              Quantity: <span className="font-medium">{quantity} kg</span>
                            </p>
                            <p className="text-sm text-coffee-600 dark:text-coffee-400">
                              Price: <span className="font-medium">₹{pricePerKg.toFixed(2)}/kg</span>
                            </p>
                            <p className="text-base font-bold text-coffee-900 dark:text-coffee-100 mt-2">
                              Total: ₹{itemTotal.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-coffee-900 dark:text-coffee-100">Order Total</span>
                    <span className="text-xl font-bold text-coffee-900 dark:text-coffee-100">₹{order.subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-coffee-600 dark:text-coffee-400">No items found for this order</p>
                {process.env.NODE_ENV === 'development' && (
                  <p className="text-xs text-gray-500 mt-2">
                    Debug: items = {JSON.stringify(order.items)}
                  </p>
                )}
              </div>
            )}
          </Card>

          <Card>
            <h2 className="text-2xl font-bold mb-4">Order Details</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-coffee-600 dark:text-coffee-400">Order Number</span>
                <span className="font-semibold text-coffee-900 dark:text-coffee-100">#{order.order_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-coffee-600 dark:text-coffee-400">Status</span>
                <span className={cn('px-3 py-1 rounded-full text-sm font-medium', statusColor)}>
                  {getStatusLabel(order.status as OrderStatus)}
                </span>
              </div>
              {order.payment_method && (
                <div className="flex justify-between">
                  <span className="text-coffee-600 dark:text-coffee-400">Payment Method</span>
                  <span className="font-semibold text-coffee-900 dark:text-coffee-100">
                    {order.payment_method === 'COD' ? 'Cash on Delivery' : 'Prepaid'}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-coffee-600 dark:text-coffee-400">Date</span>
                <span className="text-coffee-900 dark:text-coffee-100">
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
                  <span className="text-coffee-900 dark:text-coffee-100">{order.shipping_address.name}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-coffee-900 dark:text-coffee-100">{order.shipping_address.phone}</span>
                </p>
                <p className="text-coffee-600 dark:text-coffee-400">
                  {order.shipping_address.address_line1}
                </p>
                {order.shipping_address.address_line2 && (
                  <p className="text-coffee-600 dark:text-coffee-400">
                    {order.shipping_address.address_line2}
                  </p>
                )}
                <p className="text-coffee-600 dark:text-coffee-400">
                  {order.shipping_address.city}, {order.shipping_address.state} -{' '}
                  {order.shipping_address.pincode}
                </p>
                <p className="text-coffee-600 dark:text-coffee-400">
                  {order.shipping_address.country}
                </p>
              </div>
            </Card>
          )}

          {/* Shipment Tracking */}
          {/* Show tracking for all orders that have shipment (CREATED, PAID, SHIPPED, DELIVERED, CANCELLED) */}
          <ShipmentTracking orderId={order._id} orderStatus={order.status as any} />
        </div>

        <div className="lg:col-span-1">
          <Card>
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-coffee-600 dark:text-coffee-400">Subtotal</span>
                <span className="font-medium text-coffee-900 dark:text-coffee-100">₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-coffee-900 dark:text-coffee-100">Total</span>
                  <span className="text-coffee-900 dark:text-coffee-100">₹{order.subtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

