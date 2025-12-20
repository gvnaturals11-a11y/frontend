'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminSession } from '@/hooks/useAdminSession'
import { AdminSidebar } from '../components/AdminSidebar'
import { AdminHeader } from '../components/AdminHeader'

interface AdminLayoutProps {
  children: React.ReactNode
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const router = useRouter()
  const { isAuthenticated, isLoading, session } = useAdminSession()



  useEffect(() => {
    // Wait for session to load - don't redirect while loading
    if (isLoading) {
      return
    }

    // Only redirect if session is fully loaded AND not authenticated
    if (!isAuthenticated && (!session || session.user?.type !== 'admin')) {
      const timer = setTimeout(() => {
        router.push('/admin/login')
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isLoading, isAuthenticated, session, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Don't return null immediately, show loading while redirecting
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

