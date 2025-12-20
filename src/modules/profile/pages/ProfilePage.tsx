'use client'

import React from 'react'
import { useAuthStore } from '@/store/auth.store'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { User, Phone, Mail, LogOut } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, clearAuth } = useAuthStore()

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  const handleLogout = () => {
    clearAuth()
    router.push('/')
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-coffee-600">Name</label>
              <p className="text-lg font-semibold text-coffee-900">{user.name}</p>
            </div>
            <div>
              <label className="text-sm text-coffee-600 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </label>
              <p className="text-lg font-semibold text-coffee-900">{user.phone}</p>
            </div>
            {user.email && (
              <div>
                <label className="text-sm text-coffee-600 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <p className="text-lg font-semibold text-coffee-900">{user.email}</p>
              </div>
            )}
            <div>
              <label className="text-sm text-coffee-600">Role</label>
              <p className="text-lg font-semibold text-coffee-900">{user.role}</p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push('/orders')}
            >
              View My Orders
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push('/cart')}
            >
              View Cart
            </Button>
            <Button
              variant="outline"
              className="w-full text-red-600 hover:text-red-700"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

