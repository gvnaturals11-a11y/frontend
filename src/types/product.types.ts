export interface Product {
  _id: string
  name: string
  slug: string
  description?: string
  price_per_kg: number
  stock_kg: number
  is_active: boolean
  image?: string
  shipping_cost_1kg: number
  shipping_cost_2kg: number
  shipping_cost_5kg: number
  shipping_cost_10kg: number
  createdAt?: string
  updatedAt?: string
}

export interface CartItem {
  product: Product
  quantity_kg: number
}

