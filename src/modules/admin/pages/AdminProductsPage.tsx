'use client'

import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi, CreateProductRequest } from '@/lib/api/admin.api'
import { Product } from '@/types/product.types'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ProductForm } from '../components/ProductForm'
import { Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { API_BASE_URL } from '@/lib/utils/constants'

export default function AdminProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const queryClient = useQueryClient()

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: async () => {
      const response = await adminApi.getAllProducts()
      // Response format: { statusCode, status, data: Product[], message }
      // The API client interceptor returns response.data, so we get the full response object
      if (response && response.data && Array.isArray(response.data)) {
        return response.data
      }
      // Fallback: if response is directly an array (for backward compatibility)
      if (Array.isArray(response)) {
        return response
      }
      console.warn('Unexpected response format:', response)
      return []
    },
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateProductRequest) => adminApi.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
      toast.success('Product created successfully!')
      setIsModalOpen(false)
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create product')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateProductRequest> }) =>
      adminApi.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
      toast.success('Product updated successfully!')
      setIsModalOpen(false)
      setEditingProduct(null)
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update product')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
      toast.success('Product deleted successfully!')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to delete product')
    },
  })

  const handleSubmit = (data: CreateProductRequest) => {
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct._id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(id)
    }
  }

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return null
    if (imagePath.startsWith('http')) return imagePath
    if (imagePath.startsWith('/uploads')) return `${API_BASE_URL}${imagePath}`
    return `${API_BASE_URL}/uploads/products/${imagePath}`
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products Management</h1>
        <Button
          variant="primary"
          onClick={() => {
            setEditingProduct(null)
            setIsModalOpen(true)
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <ProductForm
              product={editingProduct || undefined}
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsModalOpen(false)
                setEditingProduct(null)
              }}
              isLoading={createMutation.isPending || updateMutation.isPending}
            />
          </Card>
        </div>
      )}

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
                  <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Image</th>
                  <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Name</th>
                  <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Slug</th>
                  <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Description</th>
                  <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Price (₹/kg)</th>
                  <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Stock (kg)</th>
                  <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products && products.length > 0 ? (
                  products.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <td className="p-4">
                        {product.image ? (
                          <>
                            <img
                              src={getImageUrl(product.image) || ''}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded-lg"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                                const fallback = e.currentTarget.nextElementSibling as HTMLElement
                                if (fallback) fallback.classList.remove('hidden')
                              }}
                            />
                            <div className="hidden w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                              <ImageIcon className="w-8 h-8 text-gray-400" />
                            </div>
                          </>
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                          {product.name}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {product.slug}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                          {product.description || 'No description'}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                          ₹{product.price_per_kg}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-gray-600 dark:text-gray-400">
                          {product.stock_kg} kg
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            product.is_active
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(product)}
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(product._id)}
                            className="text-red-600 hover:text-red-700 dark:text-red-400"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-500 dark:text-gray-400">
                      No products found. Click "Add Product" to create your first product.
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

