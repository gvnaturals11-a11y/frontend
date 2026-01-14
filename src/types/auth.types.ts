export interface User {
  id: string
  name: string
  phone: string
  email?: string | null
  role: 'USER' | 'ADMIN'
}

export interface Admin {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'SUPER_ADMIN'
}

export interface AuthResponse {
  access_token: string
  user?: User
  admin?: Admin
}

export interface SendOtpRequest {
  phone: string
}

export interface VerifyOtpRequest {
  phone: string
  otp: string
  name?: string
}

export interface AdminLoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  phone: string
  password?: string
}

export interface LoginRequest {
  phone: string
  password?: string
}
