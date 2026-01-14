import { create } from 'zustand'
import { Admin } from '@/types/auth.types'
import { ADMIN_TOKEN_STORAGE_KEY } from '@/lib/utils/constants'

interface AdminState {
  admin: Admin | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (admin: Admin, token: string) => void
  clearAuth: () => void
  init: () => void
}

const getStoredAdmin = () => {
  if (typeof window === 'undefined') return { admin: null, token: null }

  const token = localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY)
  const adminStr = localStorage.getItem('admin_user')
  const admin = adminStr ? JSON.parse(adminStr) : null

  return { admin, token }
}

export const useAdminStore = create<AdminState>((set) => ({
  admin: null,
  token: null,
  isAuthenticated: false,

  setAuth: (admin, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token)
      localStorage.setItem('admin_user', JSON.stringify(admin))
    }
    set({ admin, token, isAuthenticated: true })
  },

  clearAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY)
      localStorage.removeItem('admin_user')
    }
    set({ admin: null, token: null, isAuthenticated: false })
  },

  init: () => {
    const { admin, token } = getStoredAdmin()
    set({ admin, token, isAuthenticated: !!token && !!admin })
  },
}))

