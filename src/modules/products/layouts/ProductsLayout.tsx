'use client'

import React from 'react'
import { MainLayout } from '@/components/layout/MainLayout'

interface ProductsLayoutProps {
  children: React.ReactNode
}

export const ProductsLayout: React.FC<ProductsLayoutProps> = ({ children }) => {
  return <MainLayout>{children}</MainLayout>
}

