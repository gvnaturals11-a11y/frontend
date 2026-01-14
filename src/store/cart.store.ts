import { create } from 'zustand'
import { CartItem } from '@/types/product.types'

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getShippingCost: () => number
  getTotalWithShipping: () => number
  getItemCount: () => number
  init: () => void
}

const getStoredCart = (): CartItem[] => {
  if (typeof window === 'undefined') return []
  const cartStr = localStorage.getItem('cart_items')
  return cartStr ? JSON.parse(cartStr) : []
}

const saveCart = (items: CartItem[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cart_items', JSON.stringify(items))
  }
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (item) => {
    const existingItem = get().items.find((i) => i.product._id === item.product._id)
    if (existingItem) {
      get().updateQuantity(item.product._id, existingItem.quantity_kg + item.quantity_kg)
    } else {
      const newItems = [...get().items, item]
      set({ items: newItems })
      saveCart(newItems)
    }
  },

  removeItem: (productId) => {
    const newItems = get().items.filter((i) => i.product._id !== productId)
    set({ items: newItems })
    saveCart(newItems)
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId)
      return
    }
    const newItems = get().items.map((item) =>
      item.product._id === productId ? { ...item, quantity_kg: quantity } : item
    )
    set({ items: newItems })
    saveCart(newItems)
  },

  clearCart: () => {
    set({ items: [] })
    saveCart([])
  },

  getShippingCost: () => {
    const items = get().items
    if (items.length === 0) return 0

    // Calculate shipping for each product individually and sum them
    const totalShipping = items.reduce((total, item) => {
      const quantity = item.quantity_kg
      let shipping = 0

      // Fixed shipping costs based on exact quantity
      // 1kg -> ₹70, 2kg -> ₹130, 5kg -> ₹230, 10kg -> ₹350
      switch (quantity) {
        case 1:
          shipping = 70
          break
        case 2:
          shipping = 130
          break
        case 5:
          shipping = 230
          break
        case 10:
          shipping = 350
          break
        default:
          // Fallback for any other quantity (shouldn't happen with our UI)
          shipping = 70
      }

      return total + shipping
    }, 0)

    return totalShipping
  },

  getTotal: () => {
    return get().items.reduce((total, item) => total + item.product.price_per_kg * item.quantity_kg, 0)
  },

  getTotalWithShipping: () => {
    return get().getTotal() + get().getShippingCost()
  },

  getItemCount: () => {
    return get().items.length
  },

  init: () => {
    const items = getStoredCart()
    set({ items })
  },
}))

