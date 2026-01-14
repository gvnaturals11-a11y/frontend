import { create } from 'zustand'
import { User } from '@/types/auth.types'
import { TOKEN_STORAGE_KEY } from '@/lib/utils/constants'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
  init: () => void
}

const getStoredAuth = () => {
  if (typeof window === 'undefined') return { user: null, token: null }

  const token = localStorage.getItem(TOKEN_STORAGE_KEY)
  const userStr = localStorage.getItem('auth_user')
  const user = userStr ? JSON.parse(userStr) : null

  return { user, token }
}

export const useAuthStore = create<AuthState>((set) => {
  return {
    user: null,
    token: null,
    isAuthenticated: false,

    setAuth: (user, token) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_STORAGE_KEY, token)
        localStorage.setItem('auth_user', JSON.stringify(user))
      }
      set({ user, token, isAuthenticated: true })
    },

    clearAuth: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_STORAGE_KEY)
        localStorage.removeItem('auth_user')
      }
      set({ user: null, token: null, isAuthenticated: false })
    },

    init: () => {
      const { user, token } = getStoredAuth()
      set({ user, token, isAuthenticated: !!token && !!user })
    },
  }
})

