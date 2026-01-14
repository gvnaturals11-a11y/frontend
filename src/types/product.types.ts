export interface Product {
  _id: string
  name: string
  slug: string
  description?: string
  price_per_kg: number
  stock_kg: number
  is_active: boolean
  image?: string
  shipping_cost?: number
  createdAt?: string
  updatedAt?: string
}

export interface CartItem {
  product: Product
  quantity_kg: number
}

