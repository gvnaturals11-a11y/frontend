'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cart.store'
import { useAuthStore } from '@/store/auth.store'
import { ShippingForm } from '../components/ShippingForm'
import { Card } from '@/components/ui/Card'
import { ShippingAddress, CreateOrderRequest } from '@/types/order.types'
import { ordersApi } from '@/lib/api/orders.api'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { ShoppingCart } from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const items = useCartStore((state) => state.items)
  const getTotal = useCartStore((state) => state.getTotal)
  const clearCart = useCartStore((state) => state.clearCart)
  const { isAuthenticated } = useAuthStore()

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    if (items.length === 0) {
      router.push('/cart')
    }
  }, [isAuthenticated, items.length, router])

  const createOrderMutation = useMutation({
    mutationFn: (data: CreateOrderRequest) => ordersApi.create(data),
    onSuccess: (response) => {
      toast.success('Order placed successfully!')
      clearCart()
      router.push(`/orders/${response.data._id}`)
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to place order')
    },
  })

  const handleSubmit = (shippingAddress: ShippingAddress) => {
    if (items.length === 0) {
      toast.error('Cart is empty')
      return
    }

    const orderData: CreateOrderRequest = {
      items: items.map((item) => ({
        product_id: item.product._id,
        quantity_kg: item.quantity_kg,
      })),
      shipping_address: shippingAddress,
    }

    createOrderMutation.mutate(orderData)
  }

  if (items.length === 0) {
    return null
  }

  const subtotal = getTotal()
  const shipping = 50
  const total = subtotal + shipping

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
            <ShippingForm
              onSubmit={handleSubmit}
              isLoading={createOrderMutation.isPending}
            />
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div key={item.product._id} className="flex justify-between text-sm">
                  <span>
                    {item.product.name} ({item.quantity_kg}kg)
                  </span>
                  <span>₹{(item.product.price_per_kg * item.quantity_kg).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{shipping.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

