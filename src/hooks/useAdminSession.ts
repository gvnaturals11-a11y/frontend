import { useSession } from 'next-auth/react'
import { Admin } from '@/types/auth.types'

export const useAdminSession = () => {
  const { data: session, status } = useSession()

  const isAdmin = session?.user?.type === 'admin'
  const isAuthenticated = status === 'authenticated' && isAdmin

  const admin: Admin | null = isAuthenticated && session?.user
    ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role as 'ADMIN' | 'SUPER_ADMIN',
      }
    : null

  const accessToken = session?.accessToken as string | undefined

  return {
    admin,
    session,
    isAuthenticated,
    isLoading: status === 'loading',
    accessToken,
  }
}

