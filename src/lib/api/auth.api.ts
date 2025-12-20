import { apiClient } from './client'
import { ApiResponse } from '@/types/api.types'
import { AuthResponse, SendOtpRequest, VerifyOtpRequest, AdminLoginRequest } from '@/types/auth.types'

export const authApi = {
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

