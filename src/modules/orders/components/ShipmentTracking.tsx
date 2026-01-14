'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { shipmentsApi } from '@/lib/api/shipments.api'
import { Card } from '@/components/ui/Card'
import { Package, Truck, MapPin, CheckCircle, XCircle, Clock, Loader2, ShoppingBag } from 'lucide-react'
import { ShipmentStatus } from '@/types/shipment.types'
import { cn } from '@/lib/utils/cn'

interface ShipmentTrackingProps {
  orderId: string
  orderStatus?: 'PENDING_PAYMENT' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'OUT FOR DELIVERY' | 'FAILED'
}

// Tracking stages in order
type TrackingStage = 'ordered' | 'shipped' | 'out_for_delivery' | 'delivered'

interface StageConfig {
  number: string
  title: string
  description: string
  Icon: React.ComponentType<{ className?: string }>
  completedColor: string
  pendingColor: string
  bgColor: string
}

const stages: Record<TrackingStage, StageConfig> = {
  ordered: {
    number: '1',
    title: 'Ordered',
    description: 'Order placed successfully',
    Icon: ShoppingBag,
    completedColor: 'text-green-600',
    pendingColor: 'text-gray-400',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
  },
  shipped: {
    number: '2',
    title: 'Shipped',
    description: 'Item dispatched',
    Icon: Package,
    completedColor: 'text-blue-600',
    pendingColor: 'text-gray-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
  },
  out_for_delivery: {
    number: '3',
    title: 'Out for delivery',
    description: 'Delivery agent has the package',
    Icon: Truck,
    completedColor: 'text-orange-600',
    pendingColor: 'text-gray-400',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
  },
  delivered: {
    number: '4',
    title: 'Delivered',
    description: 'Order delivered successfully',
    Icon: CheckCircle,
    completedColor: 'text-green-600',
    pendingColor: 'text-gray-400',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
  },
}

const statusConfig: Record<ShipmentStatus, { label: string; icon: React.ReactNode; color: string; bgColor: string }> = {
  PICKED: {
    label: 'Picked Up',
    icon: <Package className="w-5 h-5" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900',
  },
  IN_TRANSIT: {
    label: 'In Transit',
    icon: <Truck className="w-5 h-5" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900',
  },
  OUT_FOR_DELIVERY: {
    label: 'Out for Delivery',
    icon: <MapPin className="w-5 h-5" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 dark:bg-orange-900',
  },
  DELIVERED: {
    label: 'Delivered',
    icon: <CheckCircle className="w-5 h-5" />,
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900',
  },
  CANCELLED: {
    label: 'Cancelled',
    icon: <XCircle className="w-5 h-5" />,
    color: 'text-red-600',
    bgColor: 'bg-red-100 dark:bg-red-900',
  },
}

export const ShipmentTracking: React.FC<ShipmentTrackingProps> = ({ orderId, orderStatus }) => {
  const { data: shipment, isLoading, error, refetch } = useQuery({
    queryKey: ['shipment', 'tracking', orderId],
    queryFn: async () => {
      const response = await shipmentsApi.getTracking(orderId)
      if (response && typeof response === 'object' && 'data' in response) {
        return (response as any).data
      }
      return response as any
    },
    enabled: !!orderId,
    refetchInterval: 300000, // Refetch every 5 minutes
  })

  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-coffee-600" />
          <span className="ml-2 text-coffee-600">Loading tracking information...</span>
        </div>
      </Card>
    )
  }

  if (error || !shipment) {
    return (
      <Card>
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            {error ? 'Failed to load tracking information' : 'No shipment found for this order'}
          </p>
        </div>
      </Card>
    )
  }

  // Handle cancelled status
  if (shipment.status === 'CANCELLED') {
    return (
      <Card>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="font-semibold text-lg text-red-600">Order Cancelled</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This order has been cancelled
              </p>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  // Determine current stage based on shipment status and order status
  const getCurrentStage = (): TrackingStage => {
    // If order is still PENDING_PAYMENT or PAID, show "ordered" stage even if shipment exists
    if (orderStatus === 'PENDING_PAYMENT' || orderStatus === 'PAID') {
      return 'ordered'
    }

    // Otherwise, determine based on shipment status
    switch (shipment.status) {
      case 'PICKED':
      case 'IN_TRANSIT':
        return 'shipped'
      case 'OUT_FOR_DELIVERY':
        return 'out_for_delivery'
      case 'DELIVERED':
        return 'delivered'
      default:
        return 'ordered'
    }
  }

  const currentStage = getCurrentStage()
  const stageKeys: TrackingStage[] = ['ordered', 'shipped', 'out_for_delivery', 'delivered']
  const currentStageIndex = stageKeys.indexOf(currentStage)

  // Check if stage is completed
  const isStageCompleted = (stage: TrackingStage): boolean => {
    const stageIndex = stageKeys.indexOf(stage)
    return stageIndex <= currentStageIndex
  }

  // Check if stage is active (current stage)
  const isStageActive = (stage: TrackingStage): boolean => {
    return stage === currentStage
  }

  // Get estimated delivery date
  const estimatedDelivery = shipment.tracking_data?.shipment_track?.[0]?.estimated_delivery_date
  const isToday = estimatedDelivery && new Date(estimatedDelivery).toDateString() === new Date().toDateString()

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-6">Track Your Order</h2>

          {/* Progress Timeline */}
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {stageKeys.map((stageKey, index) => {
                const stage = stages[stageKey]
                const isCompleted = isStageCompleted(stageKey)
                const isActive = isStageActive(stageKey)
                const isLast = index === stageKeys.length - 1

                return (
                  <div key={stageKey} className="relative">
                    <div className={cn(
                      'flex flex-col items-center text-center p-4 rounded-lg transition-all',
                      isCompleted && stage.bgColor,
                      isActive && 'ring-2 ring-offset-2',
                      isActive && stage.completedColor === 'text-green-600' && 'ring-green-500',
                      isActive && stage.completedColor === 'text-blue-600' && 'ring-blue-500',
                      isActive && stage.completedColor === 'text-orange-600' && 'ring-orange-500',
                    )}>
                      {/* Stage Number Circle */}
                      <div className={cn(
                        'w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all',
                        isCompleted
                          ? `bg-white dark:bg-gray-800 ${stage.completedColor} shadow-md`
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                      )}>
                        {isCompleted && !isActive ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <div className={cn(
                            'text-lg font-bold',
                            isCompleted ? stage.completedColor : stage.pendingColor
                          )}>
                            {stage.number}
                          </div>
                        )}
                      </div>

                      {/* Stage Icon */}
                      <div className={cn(
                        'mb-2 transition-all',
                        isCompleted ? stage.completedColor : stage.pendingColor
                      )}>
                        <stage.Icon className={cn(
                          'w-8 h-8 transition-transform',
                          isActive && 'scale-110'
                        )} />
                      </div>

                      {/* Stage Title */}
                      <h3 className={cn(
                        'font-semibold text-sm mb-1 transition-all',
                        isCompleted
                          ? (isActive ? stage.completedColor : 'text-gray-900 dark:text-gray-100')
                          : stage.pendingColor
                      )}>
                        {stage.title}
                      </h3>

                      {/* Stage Description */}
                      <p className={cn(
                        'text-xs transition-all',
                        isCompleted
                          ? 'text-gray-700 dark:text-gray-300'
                          : 'text-gray-500 dark:text-gray-500'
                      )}>
                        {stage.description}
                      </p>

                      {/* Special indicators */}
                      {stageKey === 'shipped' && isActive && shipment.awb && (
                        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-xs font-medium text-gray-900 dark:text-gray-100">
                            Tracking ID: {shipment.awb}
                          </p>
                        </div>
                      )}

                      {stageKey === 'out_for_delivery' && isActive && (
                        <div className="mt-2 pt-2 border-t border-orange-200 dark:border-orange-800">
                          <p className="text-xs font-bold text-orange-600 dark:text-orange-400">
                            {isToday ? 'Arriving today' : 'On the way'}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Connecting Line */}
                    {!isLast && (
                      <div className="hidden md:block absolute top-1/2 left-full w-full -translate-y-1/2">
                        <div className={cn(
                          'h-0.5 transition-all',
                          isStageCompleted(stageKey)
                            ? 'bg-green-500'
                            : 'bg-gray-300 dark:bg-gray-600'
                        )} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-6 space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            {/* Courier Information */}
            {(shipment.courier_name || shipment.awb) && (
              <div className="flex flex-wrap gap-4 text-sm">
                {shipment.courier_name && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Courier: </span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {shipment.courier_name}
                    </span>
                  </div>
                )}
                {shipment.awb && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Tracking ID: </span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {shipment.awb}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Estimated Delivery */}
            {estimatedDelivery && currentStage !== 'delivered' && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">Expected Delivery: </span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {new Date(estimatedDelivery).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            )}

            {/* Last Updated */}
            {shipment.last_tracked_at && (
              <div className="text-xs text-gray-500 dark:text-gray-500">
                Last updated: {new Date(shipment.last_tracked_at).toLocaleString('en-IN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
