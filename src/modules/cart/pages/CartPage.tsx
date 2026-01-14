'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cart.store'
import { useAuthStore } from '@/store/auth.store'
import { CartItem } from '../components/CartItem'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ShoppingBag, ShoppingCart } from 'lucide-react'

export default function CartPage() {
  const router = useRouter()
  const [mounted, setMounted] = React.useState(false)
  const { isAuthenticated } = useAuthStore()
  const items = useCartStore((state) => state.items)
  const getTotal = useCartStore((state) => state.getTotal)
  const getShippingCost = useCartStore((state) => state.getShippingCost)
  const getTotalWithShipping = useCartStore((state) => state.getTotalWithShipping)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login')
      return
    }
  }, [isAuthenticated, router, mounted])

  if (!mounted || !isAuthenticated) {
    return null
  }

  const total = getTotal()
  const shipping = getShippingCost()
  const finalTotal = getTotalWithShipping()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="text-center py-12">
          <ShoppingBag className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-coffee-600 mb-6">
            Add some products to get started!
          </p>
          <Button variant="primary" onClick={() => router.push('/products')}>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Browse Products
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {items.map((item) => (
            <CartItem key={item.product._id} item={item} />
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{shipping.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => router.push('/checkout')}
            >
              Proceed to Checkout
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}

