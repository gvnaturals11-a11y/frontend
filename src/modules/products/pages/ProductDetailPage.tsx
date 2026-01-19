'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { productsApi } from '@/lib/api/products.api'
import { ordersApi } from '@/lib/api/orders.api'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ShoppingCart, Minus, Plus, Package, ArrowLeft } from 'lucide-react'
// import { useCartStore } from '@/store/cart.store' // CART FUNCTIONALITY COMMENTED OUT
import { useAuthStore } from '@/store/auth.store'
import toast from 'react-hot-toast'
import { API_BASE_URL } from '@/lib/utils/constants'
import { ShippingAddress, CreateOrderRequest } from '@/types/order.types'
import { ShippingForm } from '@/modules/checkout/components/ShippingForm'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  // CART FUNCTIONALITY COMMENTED OUT
  // const items = useCartStore((state) => state.items)
  // const addItem = useCartStore((state) => state.addItem)
  // const updateQuantity = useCartStore((state) => state.updateQuantity)
  const { isAuthenticated } = useAuthStore()

  // CART FUNCTIONALITY COMMENTED OUT - Using direct quantity state
  // const cartItem = items.find(item => item.product._id === productId)
  const [quantity, setQuantity] = useState(1)
  const [showCheckout, setShowCheckout] = useState(false)

  // CART FUNCTIONALITY COMMENTED OUT
  // React.useEffect(() => {
  //   if (cartItem) {
  //     setQuantity(cartItem.quantity_kg)
  //   }
  // }, [cartItem])

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const response = await productsApi.getById(productId)
      // API client interceptor returns response.data from axios
      // Backend returns: { statusCode: 200, status: "success", data: {...}, message: "..." }
      // After interceptor, response is the ApiResponse object
      // So we need to access response.data to get the product object

      // Check if response is ApiResponse format with data property
      if (response && typeof response === 'object' && 'data' in response) {
        const productData = (response as any).data
        // Check if data has _id (it's the product object)
        if (productData && typeof productData === 'object' && '_id' in productData) {
          return productData
        }
      }

      // Check if response is already a product object (old format)
      if (response && typeof response === 'object' && '_id' in response) {
        return response as any
      }

      return null
    },
    enabled: !!productId,
  })

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return null
    if (imagePath.startsWith('http')) return imagePath
    if (imagePath.startsWith('/uploads')) return `${API_BASE_URL}${imagePath}`
    return `${API_BASE_URL}/uploads/products/${imagePath}`
  }

  // CART FUNCTIONALITY COMMENTED OUT - Using direct order placement
  // const handleAddToCart = () => {
  //   if (!product) return

  //   // Check if user is authenticated
  //   if (!isAuthenticated) {
  //     toast.error('Please login to add items to cart')
  //     router.push('/login')
  //     return
  //   }

  //   if (cartItem) {
  //     // Product already in cart, update quantity
  //     updateQuantity(product._id, quantity)
  //     toast.success(`Updated ${product.name} to ${quantity}kg!`)
  //   } else {
  //     // Add new item to cart
  //     addItem({
  //       product,
  //       quantity_kg: quantity,
  //     })
  //     toast.success(`${quantity}kg of ${product.name} added to cart!`)
  //   }
  // }

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
          toast.success('Payment successful!')
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

  const handleBuyNow = () => {
    if (!product) return

    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error('Please login to place an order')
      router.push('/login')
      return
    }

    // Show checkout form
    setShowCheckout(true)
  }

  const handleSubmitOrder = (shippingAddress: ShippingAddress) => {
    if (!product) return

    const orderData: CreateOrderRequest = {
      items: [{
        product_id: product._id,
        quantity_kg: quantity,
      }],
      shipping_address: shippingAddress,
      payment_method: 'PREPAID',
    }

    createOrderMutation.mutate(orderData)
  }

  const handleQuantityChange = (delta: number) => {
    if (!product) return
    const newQuantity = Math.max(1, Math.min(quantity + delta, product.stock_kg))
    setQuantity(newQuantity)
  }

  // Calculate shipping cost based on quantity
  const getShippingCost = (qty: number): number => {
    // Fixed shipping costs based on exact quantity
    // 1kg -> ₹70, 2kg -> ₹130, 5kg -> ₹230, 10kg -> ₹350
    switch (qty) {
      case 1:
        return 70
      case 2:
        return 130
      case 5:
        return 230
      case 10:
        return 350
      default:
        // Fallback for any other quantity
        return 70
    }
  }

  const subtotal = product ? product.price_per_kg * quantity : 0
  const shippingCost = getShippingCost(quantity)
  const totalWithShipping = subtotal + shippingCost


  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <p className="text-red-600 dark:text-red-400">
            Product not found or failed to load.
          </p>
        </Card>
      </div>
    )
  }

  const isOutOfStock = product.stock_kg <= 0

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden relative">
            {getImageUrl(product.image) ? (
              <Image
                src={getImageUrl(product.image)!}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                unoptimized
              />
            ) : (
              <Package className="w-32 h-32 text-gray-400" />
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-3xl font-bold text-primary mb-4">
              ₹{product.price_per_kg}/kg
            </p>
            {product.description && (
              <p className="text-coffee-600 mb-4">
                {product.description}
              </p>
            )}
            <p className={`text-sm ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
              {isOutOfStock ? 'Out of Stock' : `${product.stock_kg}kg available`}
            </p>
          </div>

          {!showCheckout ? (
            <Card>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-3">Select Quantity</label>
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[1, 2, 5, 10].map((qty) => (
                      <button
                        key={qty}
                        type="button"
                        onClick={() => setQuantity(qty)}
                        disabled={qty > product.stock_kg || isOutOfStock}
                        className={`
                          py-2 text-sm font-medium rounded-md focus:outline-none transition-all
                          ${quantity === qty
                            ? 'bg-primary text-white shadow-md ring-2 ring-primary ring-offset-2'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }
                          ${qty > product.stock_kg || isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                      >
                        {qty} kg
                      </button>
                    ))}
                  </div>
                  <div className="space-y-2 py-3 border-t border-gray-100 dark:border-gray-700 mb-4">
                    <div className="flex justify-between items-center text-gray-600">
                      <span>Subtotal:</span>
                      <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-600">
                      <span>Shipping:</span>
                      <span className="font-medium">₹{shippingCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                      <span className="text-lg font-semibold">Total:</span>
                      <span className="text-2xl font-bold text-coffee-800">
                        ₹{totalWithShipping.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleBuyNow}
                  disabled={isOutOfStock || !product.is_active}
                  className="w-full"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Buy Now
                </Button>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Shipping Details</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCheckout(false)}
                  >
                    ← Back to Product
                  </Button>
                </div>

                <div className="bg-coffee-50 dark:bg-coffee-900/20 p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{product.name}</span>
                    <span className="font-medium">{quantity} kg</span>
                  </div>
                  <div className="space-y-2 pt-2 border-t border-coffee-200">
                    <div className="flex justify-between items-center text-sm">
                      <span>Subtotal:</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Shipping:</span>
                      <span>₹{shippingCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold text-primary pt-2 border-t border-coffee-200">
                      <span>Total:</span>
                      <span>₹{totalWithShipping.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <ShippingForm
                  onSubmit={handleSubmitOrder}
                  isLoading={createOrderMutation.isPending}
                />
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

