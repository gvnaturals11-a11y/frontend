'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CartItem as CartItemType } from '@/types/product.types'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Minus, Plus, Trash2, Package } from 'lucide-react'
import { useCartStore } from '@/store/cart.store'

interface CartItemProps {
  item: CartItemType
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCartStore()

  const handleQuantityChange = (delta: number) => {
    const newQuantity = item.quantity_kg + delta
    if (newQuantity <= 0) {
      removeItem(item.product._id)
    } else {
      updateQuantity(item.product._id, newQuantity)
    }
  }

  const total = item.product.price_per_kg * item.quantity_kg

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <Card className="mb-4">
        <div className="flex gap-4">
          <div className="w-24 h-24 bg-coffee-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Package className="w-12 h-12 text-coffee-400" />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1 text-coffee-900">{item.product.name}</h3>
            <p className="text-sm text-coffee-600 mb-2">
              ₹{item.product.price_per_kg}/kg
            </p>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(-1)}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-semibold">
                  {item.quantity_kg}kg
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(1)}
                  disabled={item.quantity_kg >= item.product.stock_kg}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xl font-bold">₹{total.toFixed(2)}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.product._id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

