import { apiClient } from './client'
import { ApiResponse } from '@/types/api.types'
import { AuthResponse, SendOtpRequest, VerifyOtpRequest, AdminLoginRequest, RegisterRequest, LoginRequest } from '@/types/auth.types'

export const authApi = {
  register: async (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    return apiClient.user.post('/auth/register', data)
  },

  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    return apiClient.user.post('/auth/login', data)
  },

  sendOtp: async (data: SendOtpRequest): Promise<ApiResponse<{ otp: string }>> => {
    return apiClient.user.post('/auth/send-otp', data)
  },

  verifyOtp: async (data: VerifyOtpRequest): Promise<ApiResponse<AuthResponse>> => {
    return apiClient.user.post('/auth/verify-otp', data)
  },

  adminLogin: async (data: AdminLoginRequest): Promise<ApiResponse<AuthResponse>> => {
    return apiClient.admin.post('/admin/login', data)
  },
}

