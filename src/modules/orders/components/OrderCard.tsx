'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Order, OrderStatus } from '@/types/order.types'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Package } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface OrderCardProps {
  order: Order
}

const statusColors: Record<OrderStatus, string> = {
  CREATED: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
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

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const statusColor = statusColors[order.status as OrderStatus] || statusColors.CREATED

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card hover>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-coffee-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-coffee-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-coffee-900">Order #{order.order_number}</h3>
                <p className="text-sm text-coffee-600">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-3 flex-wrap">
              <span className={cn('px-3 py-1 rounded-full text-xs font-medium', statusColor)}>
                {getStatusLabel(order.status as OrderStatus)}
              </span>
              <span className="text-lg font-bold text-coffee-900">₹{order.subtotal.toFixed(2)}</span>
              {order.payment_method === 'COD' && (
                <span className="text-xs text-coffee-600 bg-coffee-50 dark:bg-coffee-900/20 px-2 py-1 rounded">
                  COD
                </span>
              )}
              {(order.status === 'SHIPPED' || order.status === 'DELIVERED') && (
                <span className="text-xs text-coffee-600 flex items-center gap-1">
                  <Package className="w-3 h-3" />
                  Track Shipment
                </span>
              )}
            </div>

            {order.shipping_address && (
              <p className="text-sm text-coffee-600">
                {order.shipping_address.city}, {order.shipping_address.state}
              </p>
            )}
          </div>

          <Link href={`/orders/${order._id}`}>
            <Button variant="outline" size="sm">
              View Details
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  )
}

