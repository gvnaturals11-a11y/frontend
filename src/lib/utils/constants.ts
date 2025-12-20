export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const TOKEN_STORAGE_KEY = 'gvnatural_user_token'
export const ADMIN_TOKEN_STORAGE_KEY = 'gvnatural_admin_token'

export const OTP_LENGTH = 6
export const OTP_RESEND_COOLDOWN = 60 // seconds

export const PHONE_REGEX = /^\+91[0-9]{10}$/
export const OTP_REGEX = /^[0-9]{6}$/

