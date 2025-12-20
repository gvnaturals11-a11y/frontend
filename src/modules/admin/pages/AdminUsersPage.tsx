'use client'

import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@/lib/api/admin.api'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { User, Mail, Phone, ToggleLeft, ToggleRight } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminUsersPage() {
  const queryClient = useQueryClient()

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const response = await adminApi.getAllUsers()
      // Handle response format: { statusCode, status, data: User[], message }
      if (response && response.data && Array.isArray(response.data)) {
        return response.data
      }
      // Fallback: if response is directly an array
      if (Array.isArray(response)) {
        return response
      }
      return []
    },
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      adminApi.updateUserStatus(id, is_active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      toast.success('User status updated!')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update status')
    },
  })

  const handleToggleStatus = (userId: string, currentStatus: boolean) => {
    updateStatusMutation.mutate({ id: userId, is_active: !currentStatus })
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Users Management</h1>

      {isLoading ? (
        <Card>
          <div className="p-8">
            <div className="animate-pulse space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
              ))}
            </div>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Name</th>
                  <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Phone</th>
                  <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Email</th>
                  <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Role</th>
                  <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users && users.length > 0 ? (
                  users.map((user: any) => (
                    <tr
                      key={user._id || user.id}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-400" />
                          </div>
                          <div className="font-semibold text-gray-900 dark:text-gray-100">
                            {user.name}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Phone className="w-4 h-4" />
                          {user.phone}
                        </div>
                      </td>
                      <td className="p-4">
                        {user.email ? (
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Mail className="w-4 h-4" />
                            {user.email}
                          </div>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {user.role || 'USER'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            user.is_active !== false
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {user.is_active !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleStatus(user._id || user.id, user.is_active !== false)}
                          className="text-2xl hover:opacity-70 transition-opacity"
                          title={user.is_active !== false ? 'Deactivate' : 'Activate'}
                        >
                          {user.is_active !== false ? (
                            <ToggleRight className="w-6 h-6 text-green-600" />
                          ) : (
                            <ToggleLeft className="w-6 h-6 text-gray-400" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500 dark:text-gray-400">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}

