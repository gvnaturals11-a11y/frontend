// Order item for creating orders (sent to backend)
export interface CreateOrderItem {
  product_id: string
  quantity_kg: number
}

// Order item in response (from backend)
export interface OrderItem {
  product_id: string | {
    _id: string
    name: string
    slug?: string
    image?: string
    price_per_kg?: number
  }
  quantity_kg: number
  price_per_kg: number
}

export interface ShippingAddress {
  name: string
  phone: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  pincode: string
  country: string
}

export type PaymentMethod = 'PREPAID'

export interface CreateOrderRequest {
  items: CreateOrderItem[]
  shipping_address: ShippingAddress
  payment_method?: PaymentMethod
}

export type OrderStatus = 'PENDING_PAYMENT' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'OUT FOR DELIVERY' | 'FAILED'

export interface Order {
  _id: string
  order_number: string
  user_id: string
  status: OrderStatus
  payment_method: PaymentMethod
  subtotal: number
  shipping_cost: number
  total_amount: number
  shipping_address: ShippingAddress
  razorpay_order_id?: string
  razorpay_payment_id?: string
  razorpay_key?: string
  razorpay_order?: any
  items?: OrderItem[]
  createdAt?: string
  updatedAt?: string
}

