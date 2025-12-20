import { apiClient } from './client'
import { ApiResponse } from '@/types/api.types'
import { Product } from '@/types/product.types'

export const productsApi = {
  getAll: async (): Promise<ApiResponse<Product[]>> => {
    return apiClient.user.get('/products')
  },

  getById: async (id: string): Promise<ApiResponse<Product>> => {
    return apiClient.user.get(`/products/${id}`)
  },
}

