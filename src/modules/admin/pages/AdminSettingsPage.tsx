'use client'

import React from 'react'
import { useAdminStore } from '@/store/admin.store'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { User, Mail, Shield } from 'lucide-react'

export default function AdminSettingsPage() {
  const { admin } = useAdminStore()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400">Name</label>
              <p className="text-lg font-semibold">{admin?.name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <p className="text-lg font-semibold">{admin?.email}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Role
              </label>
              <p className="text-lg font-semibold">{admin?.role}</p>
            </div>
            <Button variant="outline" className="w-full">
              Edit Profile
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold mb-4">System Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive email updates
                </p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Order Alerts</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get notified of new orders
                </p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Low Stock Alerts</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get notified when stock is low
                </p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
            </div>
            <Button variant="primary" className="w-full mt-4">
              Save Settings
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

