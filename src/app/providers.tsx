'use client'

import React, { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { SessionProvider, useSession } from 'next-auth/react'
import { useAuthStore } from '@/store/auth.store'
import { useAdminStore } from '@/store/admin.store'
import { useCartStore } from '@/store/cart.store'
import { useThemeStore } from '@/store/theme.store'
import { apiClient } from '@/lib/api/client'
import { ADMIN_TOKEN_STORAGE_KEY } from '@/lib/utils/constants'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

// Component to sync NextAuth session with API client
const AdminSessionSync: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession()

  useEffect(() => {
    // Sync NextAuth session token with API client
    if (status === 'authenticated' && session?.accessToken && session?.user?.type === 'admin') {
      const token = session.accessToken as string
      // Store token in localStorage for API client interceptor (this is the primary source)
      if (typeof window !== 'undefined') {
        localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token)
      }
      // Set token getter for API client - will use localStorage as fallback
      apiClient.setAdminTokenGetter(() => {
        // First try localStorage (most reliable)
        if (typeof window !== 'undefined') {
          const storedToken = localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY)
          if (storedToken) return storedToken
        }
        // Fallback to session (might be stale in closure)
        return session?.accessToken as string | undefined
      })
    } else if (status === 'unauthenticated') {
      // Clear token if session is invalid
      if (typeof window !== 'undefined') {
        localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY)
      }
      apiClient.setAdminTokenGetter(() => null)
    }
  }, [session, status])

  return <>{children}</>
}

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initAuth = useAuthStore((state) => state.init)
  const initAdmin = useAdminStore((state) => state.init)
  const initCart = useCartStore((state) => state.init)
  const initTheme = useThemeStore((state) => state.init)

  useEffect(() => {
    initAuth()
    initAdmin()
    initCart()
    initTheme()
  }, [initAuth, initAdmin, initCart, initTheme])

  return (
    <SessionProvider 
      basePath="/api/auth/admin" 
      refetchInterval={0}
      refetchOnWindowFocus={true}
    >
      <AdminSessionSync>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'var(--toast-bg)',
                color: 'var(--toast-color)',
              },
            }}
          />
        </QueryClientProvider>
      </AdminSessionSync>
    </SessionProvider>
  )
}

