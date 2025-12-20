import { apiClient } from './client'
import { getSession } from 'next-auth/react'

// Setup admin client to use NextAuth session token
export const setupAdminClient = async () => {
  const session = await getSession()
  const token = session?.accessToken as string | undefined

  apiClient.setAdminTokenGetter(() => {
    // This will be called on each request
    // We need to get the session synchronously, so we'll use a different approach
    return token || null
  })
}

// For client-side usage with hooks
export const getAdminToken = async (): Promise<string | null> => {
  if (typeof window === 'undefined') return null
  
  const { getSession } = await import('next-auth/react')
  const session = await getSession()
  return (session?.accessToken as string) || null
}

