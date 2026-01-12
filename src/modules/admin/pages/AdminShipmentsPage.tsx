'use client'

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { shipmentsApi } from '@/lib/api/shipments.api'
import { adminApi } from '@/lib/api/admin.api'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Package, RefreshCw, X, Truck, Loader2, Search } from 'lucide-react'
import { Shipment, ShipmentStatus } from '@/types/shipment.types'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils/cn'

const statusColors: Record<ShipmentStatus, string> = {
  PICKED: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  IN_TRANSIT: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  DELIVERED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}

export default function AdminShipmentsPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedShipments, setSelectedShipments] = useState<string[]>([])

  const { data: shipments, isLoading } = useQuery({
    queryKey: ['admin', 'shipments'],
    queryFn: async () => {
      const response = await shipmentsApi.getAllShipments()
      if (response && typeof response === 'object' && 'data' in response) {
        return (response as any).data
      }
      return response as any
    },
  })

  const refreshMutation = useMutation({
    mutationFn: (shipmentId: string) => shipmentsApi.refreshShipmentStatus(shipmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'shipments'] })
      toast.success('Shipment status refreshed!')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to refresh status')
    },
  })

  const cancelMutation = useMutation({
    mutationFn: (shipmentId: string) => shipmentsApi.cancelShipment(shipmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'shipments'] })
      toast.success('Shipment cancelled!')
      setSelectedShipments([])
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to cancel shipment')
    },
  })

  const requestPickupMutation = useMutation({
    mutationFn: (shipmentIds: string[]) => shipmentsApi.requestPickup(shipmentIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'shipments'] })
      toast.success('Pickup requested!')
      setSelectedShipments([])
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to request pickup')
    },
  })

  const filteredShipments = shipments?.filter((shipment: Shipment) => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      shipment.awb?.toLowerCase().includes(term) ||
      shipment.shipment_id?.toLowerCase().includes(term) ||
      (typeof shipment.order_id === 'object' && shipment.order_id?.order_number?.toLowerCase().includes(term)) ||
      shipment.courier_name?.toLowerCase().includes(term)
    )
  }) || []

  const handleSelectShipment = (shipmentId: string) => {
    setSelectedShipments(prev =>
      prev.includes(shipmentId)
        ? prev.filter(id => id !== shipmentId)
        : [...prev, shipmentId]
    )
  }

  const handleSelectAll = () => {
    if (selectedShipments.length === filteredShipments.length) {
      setSelectedShipments([])
    } else {
      setSelectedShipments(filteredShipments.map((s: Shipment) => s._id))
    }
  }

  const getOrderNumber = (shipment: Shipment) => {
    if (typeof shipment.order_id === 'object' && shipment.order_id) {
      return shipment.order_id.order_number
    }
    return 'N/A'
  }

  const getUserName = (shipment: Shipment) => {
    if (typeof shipment.order_id === 'object' && shipment.order_id?.user_id) {
      const userId = shipment.order_id.user_id
      if (typeof userId === 'object' && userId.name) {
        return userId.name
      }
    }
    return 'N/A'
  }

  if (isLoading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Shipment Management</h1>
        <Card>
          <div className="p-8">
            <div className="animate-pulse space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
              ))}
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Shipment Management</h1>
        {selectedShipments.length > 0 && (
          <div className="flex gap-2">
            <Button
              variant="primary"
              onClick={() => requestPickupMutation.mutate(selectedShipments)}
              disabled={requestPickupMutation.isPending}
            >
              <Truck className="w-4 h-4 mr-2" />
              Request Pickup ({selectedShipments.length})
            </Button>
          </div>
        )}
      </div>

      {/* Search */}
      <Card className="mb-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by AWB, Order Number, or Courier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent bg-white dark:bg-gray-800"
            />
          </div>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left p-4">
                  <input
                    type="checkbox"
                    checked={selectedShipments.length === filteredShipments.length && filteredShipments.length > 0}
                    onChange={handleSelectAll}
                    className="rounded"
                  />
                </th>
                <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Order #</th>
                <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Customer</th>
                <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">AWB</th>
                <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Courier</th>
                <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Last Updated</th>
                <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredShipments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    No shipments found
                  </td>
                </tr>
              ) : (
                filteredShipments.map((shipment: Shipment) => (
                  <tr
                    key={shipment._id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedShipments.includes(shipment._id)}
                        onChange={() => handleSelectShipment(shipment._id)}
                        className="rounded"
                      />
                    </td>
                    <td className="p-4">
                      <span className="font-medium">{getOrderNumber(shipment)}</span>
                    </td>
                    <td className="p-4">{getUserName(shipment)}</td>
                    <td className="p-4">
                      <span className="font-mono text-sm">{shipment.awb || 'N/A'}</span>
                    </td>
                    <td className="p-4">{shipment.courier_name || 'N/A'}</td>
                    <td className="p-4">
                      <span
                        className={cn(
                          'px-3 py-1 rounded-full text-xs font-medium',
                          statusColors[shipment.status as ShipmentStatus] || statusColors.PICKED
                        )}
                      >
                        {shipment.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-400">
                      {shipment.last_tracked_at
                        ? new Date(shipment.last_tracked_at).toLocaleString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'N/A'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => refreshMutation.mutate(shipment._id)}
                          disabled={refreshMutation.isPending}
                          title="Refresh Status"
                        >
                          {refreshMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <RefreshCw className="w-4 h-4" />
                          )}
                        </Button>
                        {shipment.status !== 'DELIVERED' && shipment.status !== 'CANCELLED' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (confirm('Are you sure you want to cancel this shipment?')) {
                                cancelMutation.mutate(shipment._id)
                              }
                            }}
                            disabled={cancelMutation.isPending}
                            title="Cancel Shipment"
                          >
                            {cancelMutation.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <X className="w-4 h-4 text-red-600" />
                            )}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
