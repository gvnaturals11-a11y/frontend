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

export interface CreateOrderRequest {
  items: CreateOrderItem[]
  shipping_address: ShippingAddress
}

export type OrderStatus = 'CREATED' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

export interface Order {
  _id: string
  order_number: string
  user_id: string
  status: OrderStatus
  subtotal: number
  shipping_address: ShippingAddress
  items?: OrderItem[]
  createdAt?: string
  updatedAt?: string
}

