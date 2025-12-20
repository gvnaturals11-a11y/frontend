import { apiClient } from './client'
import { ApiResponse } from '@/types/api.types'
import { Product } from '@/types/product.types'
import { Order } from '@/types/order.types'

export interface CreateProductRequest {
  name: string
  slug: string
  description?: string
  price_per_kg: number
  stock_kg: number
  is_active?: boolean
  image?: File | null
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  _id: string
}

export const adminApi = {
  // Products
  getAllProducts: async (): Promise<ApiResponse<Product[]>> => {
    return apiClient.admin.get('/admin/products')
  },

  createProduct: async (data: CreateProductRequest): Promise<ApiResponse<Product>> => {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('slug', data.slug)
    if (data.description) formData.append('description', data.description)
    formData.append('price_per_kg', data.price_per_kg.toString())
    formData.append('stock_kg', data.stock_kg.toString())
    formData.append('is_active', (data.is_active ?? true).toString())
    if (data.image) {
      formData.append('image', data.image)
    }

    return apiClient.admin.post('/admin/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  updateProduct: async (id: string, data: Partial<CreateProductRequest>): Promise<ApiResponse<Product>> => {
    const formData = new FormData()
    if (data.name) formData.append('name', data.name)
    if (data.slug) formData.append('slug', data.slug)
    if (data.description !== undefined) formData.append('description', data.description || '')
    if (data.price_per_kg !== undefined) formData.append('price_per_kg', data.price_per_kg.toString())
    if (data.stock_kg !== undefined) formData.append('stock_kg', data.stock_kg.toString())
    if (data.is_active !== undefined) formData.append('is_active', data.is_active.toString())
    if (data.image) {
      formData.append('image', data.image)
    }

    return apiClient.admin.put(`/admin/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  deleteProduct: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.admin.delete(`/admin/products/${id}`)
  },

  // Orders
  getAllOrders: async (): Promise<ApiResponse<Order[]>> => {
    return apiClient.admin.get('/admin/orders')
  },

  getOrderById: async (id: string): Promise<ApiResponse<Order>> => {
    return apiClient.admin.get(`/admin/orders/${id}`)
  },

  updateOrderStatus: async (id: string, status: string): Promise<ApiResponse<Order>> => {
    return apiClient.admin.patch(`/admin/orders/${id}/status`, { status })
  },

  // Users
  getAllUsers: async (): Promise<ApiResponse<any[]>> => {
    return apiClient.admin.get('/admin/users')
  },

  getUserById: async (id: string): Promise<ApiResponse<any>> => {
    return apiClient.admin.get(`/admin/users/${id}`)
  },

  updateUserStatus: async (id: string, is_active: boolean): Promise<ApiResponse<any>> => {
    return apiClient.admin.patch(`/admin/users/${id}/status`, { is_active })
  },
}

