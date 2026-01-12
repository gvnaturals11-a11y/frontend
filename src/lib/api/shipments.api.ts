import { apiClient } from './client'
import { ApiResponse } from '@/types/api.types'
import { Shipment, ShippingRate, ShippingRateRequest } from '@/types/shipment.types'

export const shipmentsApi = {
  getTracking: async (orderId: string): Promise<ApiResponse<Shipment>> => {
    return apiClient.user.get(`/shipments/${orderId}/tracking`)
  },

  getShippingRates: async (data: ShippingRateRequest): Promise<ApiResponse<{ status: number; data: { available_courier_companies: ShippingRate[] } }>> => {
    return apiClient.user.post('/shipments/shipping-rates', data)
  },

  // Admin endpoints
  getAllShipments: async (): Promise<ApiResponse<Shipment[]>> => {
    return apiClient.admin.get('/admin/all')
  },

  getShipmentById: async (shipmentId: string): Promise<ApiResponse<Shipment>> => {
    return apiClient.admin.get(`/admin/${shipmentId}`)
  },

  getShipmentByOrderId: async (orderId: string): Promise<ApiResponse<Shipment>> => {
    return apiClient.admin.get(`/admin/order/${orderId}`)
  },

  refreshShipmentStatus: async (shipmentId: string): Promise<ApiResponse<Shipment>> => {
    return apiClient.admin.patch(`/admin/${shipmentId}/refresh`)
  },

  cancelShipment: async (shipmentId: string): Promise<ApiResponse<Shipment>> => {
    return apiClient.admin.patch(`/admin/${shipmentId}/cancel`)
  },

  requestPickup: async (shipmentIds: string[]): Promise<ApiResponse<any>> => {
    return apiClient.admin.post('/admin/request-pickup', { shipmentIds })
  },
}
