'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { productsApi } from '@/lib/api/products.api'
import { ProductGrid } from '../components/ProductGrid'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/Input'

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = React.useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        const response = await productsApi.getAll()

        // Check if response is already an array (old format - direct array)
        if (Array.isArray(response)) {
          return response
        }
        
        // Check if response is ApiResponse format with data property
        if (response && typeof response === 'object') {
          // TypeScript: response is ApiResponse<Product[]>, so response.data is Product[]
          const apiResponse = response as { data?: any; statusCode?: number; status?: string; message?: string }
          if (apiResponse.data && Array.isArray(apiResponse.data)) {
            return apiResponse.data
          }
        }
        
        return []
      } catch (err) {
        console.error('Error fetching products:', err)
        return []
      }
    },
  })

  const filteredProducts = React.useMemo(() => {
    if (!data) return []
    if (!searchTerm) return data
    
    const term = searchTerm.toLowerCase()
    return data.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term)
    )
  }, [data, searchTerm])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-coffee-800">Our Products</h1>
        
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Failed to load products. Please try again.
        </div>
      )}

      <ProductGrid products={filteredProducts} isLoading={isLoading} />
    </div>
  )
}

