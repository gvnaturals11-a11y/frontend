import axios, { AxiosInstance, AxiosError } from 'axios'
import { API_BASE_URL, TOKEN_STORAGE_KEY, ADMIN_TOKEN_STORAGE_KEY } from '../utils/constants'
import { ApiResponse, ApiError } from '@/types/api.types'

class ApiClient {
  private client: AxiosInstance
  private adminClient: AxiosInstance
  private adminTokenGetter?: () => string | null | undefined

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.adminClient = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  // Method to set admin token getter (for NextAuth session)
  setAdminTokenGetter(getter: () => string | null | undefined) {
    this.adminTokenGetter = getter
  }

  private setupInterceptors() {
    // User client interceptors
    this.client.interceptors.request.use((config) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_STORAGE_KEY) : null
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Admin client interceptors - supports both localStorage and NextAuth session
    this.adminClient.interceptors.request.use((config) => {
      let token: string | null | undefined = null
      
      // Try to get token from localStorage first (most reliable, always up-to-date)
      if (typeof window !== 'undefined') {
        token = localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY)
      }
      
      // Fallback to token getter (NextAuth session)
      if (!token && this.adminTokenGetter) {
        token = this.adminTokenGetter()
      }
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      // Don't set Content-Type for FormData, let browser set it with boundary
      if (config.data instanceof FormData) {
        delete config.headers['Content-Type']
      }
      
      return config
    })

    // Response interceptors
    const handleResponse = (response: any) => response.data
    const handleUserError = (error: AxiosError<ApiError>) => {
      if (error.response?.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(TOKEN_STORAGE_KEY)
          window.location.href = '/login'
        }
      }
      return Promise.reject(error.response?.data || error.message)
    }
    const handleAdminError = (error: AxiosError<ApiError>) => {
      if (error.response?.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY)
          window.location.href = '/admin/login'
        }
      }
      return Promise.reject(error.response?.data || error.message)
    }

    this.client.interceptors.response.use(handleResponse, handleUserError)
    this.adminClient.interceptors.response.use(handleResponse, handleAdminError)
  }

  get user() {
    return this.client
  }

  get admin() {
    return this.adminClient
  }
}

export const apiClient = new ApiClient()

