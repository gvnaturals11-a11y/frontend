'use client'

import React from 'react'
import Link from 'next/link'
import { useAdminSession } from '@/hooks/useAdminSession'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { Bell, User, ArrowLeft } from 'lucide-react'

export const AdminHeader: React.FC = () => {
  const { admin } = useAdminSession()

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Website</span>
          </Link>
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
          <h2 className="text-xl font-semibold">Admin Dashboard</h2>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <ThemeToggle />

          <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <User className="w-5 h-5" />
            <span className="text-sm font-medium">{admin?.name}</span>
          </div>
        </div>
      </div>
    </header>
  )
}

