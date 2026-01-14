'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cart.store'
import { useAuthStore } from '@/store/auth.store'
import { ShippingForm } from '../components/ShippingForm'
import { Card } from '@/components/ui/Card'
import { ShippingAddress, CreateOrderRequest, PaymentMethod } from '@/types/order.types'
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
      const order = response.data
      console.log('✅ Order created successfully:', order)
      console.log('Razorpay Order ID:', order.razorpay_order?.id)
      console.log('Razorpay Key:', order.razorpay_key)

      // Check if Razorpay is loaded
      // @ts-ignore
      if (typeof window.Razorpay === 'undefined') {
        console.error('❌ Razorpay script not loaded!')
        toast.error('Payment gateway not loaded. Please refresh the page.')
        return
      }

      console.log('✅ Razorpay script loaded successfully')

      // Initialize Razorpay options
      const options = {
        key: order.razorpay_key,
        amount: order.razorpay_order.amount,
        currency: order.razorpay_order.currency,
        name: 'GV Natural',
        description: 'Buying Organic Products',
        order_id: order.razorpay_order.id,
        handler: function (response: any) {
          console.log('✅ Payment successful!', response)
          console.log('Payment ID:', response.razorpay_payment_id)
          console.log('Order ID:', response.razorpay_order_id)
          console.log('Signature:', response.razorpay_signature)

          // On successful payment, redirect to order success page
          // The backend webhook will handle the PAID status update
          toast.success('Payment successful!')
          clearCart()
          router.push(`/orders/${order._id}`)
        },
        prefill: {
          name: order.shipping_address.name,
          contact: order.shipping_address.phone,
        },
        theme: {
          color: '#5c4033', // coffee-600
        },
        modal: {
          ondismiss: function () {
            console.log('⚠️ Payment modal dismissed by user')
            toast.error('Payment cancelled')
          }
        }
      }

      console.log('Opening Razorpay payment modal...')
      // @ts-ignore
      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (response: any) {
        console.error('❌ Payment failed:', response.error)
        toast.error(`Payment failed: ${response.error.description}`)
      })
      rzp.open()
    },
    onError: (error: any) => {
      console.error('❌ Order creation failed:', error)
      toast.error(error?.message || 'Failed to initiate order')
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
      payment_method: 'PREPAID',
    }

    createOrderMutation.mutate(orderData)
  }

  const subtotal = getTotal()
  const shipping = useCartStore((state) => state.getShippingCost())
  const total = subtotal + shipping

  if (items.length === 0) {
    return null
  }

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
              <div className="pt-2 mt-2 border-t">
                <div className="bg-coffee-50 dark:bg-coffee-900/20 p-3 rounded-lg">
                  <p className="text-sm font-medium text-coffee-900 dark:text-coffee-100">
                    Payment Method: Online Payment
                  </p>
                  <p className="text-xs text-coffee-600 dark:text-coffee-400 mt-1">
                    Secure payment via Razorpay
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

