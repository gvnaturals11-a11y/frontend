import { apiClient } from './client'
import { ApiResponse } from '@/types/api.types'
import { Order, CreateOrderRequest } from '@/types/order.types'

export const ordersApi = {
  create: async (data: CreateOrderRequest): Promise<ApiResponse<Order>> => {
    return apiClient.user.post('/orders', data)
  },

  getMyOrders: async (): Promise<ApiResponse<Order[]>> => {
    return apiClient.user.get('/orders/my')
  },

  getById: async (id: string): Promise<ApiResponse<Order>> => {
    return apiClient.user.get(`/orders/${id}`)
  },
}

