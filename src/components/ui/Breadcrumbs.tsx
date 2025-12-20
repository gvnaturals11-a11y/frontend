'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { usePathname } from 'next/navigation'

interface BreadcrumbItem {
  label: string
  href?: string
}

export const Breadcrumbs: React.FC = () => {
  const pathname = usePathname()
  
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    if (!pathname) return []
    
    const paths = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/' },
    ]

    let currentPath = ''
    paths.forEach((path, index) => {
      currentPath += `/${path}`
      
      // Format label
      let label = path
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      
      // Special cases
      if (path === 'admin') label = 'Admin'
      if (path === 'products') label = 'Products'
      if (path === 'cart') label = 'Cart'
      if (path === 'checkout') label = 'Checkout'
      if (path === 'orders') label = 'Orders'
      if (path === 'profile') label = 'Profile'
      if (path === 'login') label = 'Login'
      if (path === 'verify-otp') label = 'Verify OTP'
      
      // Don't add link for current page
      const isLast = index === paths.length - 1
      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath,
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  // Don't show breadcrumbs on home page
  if (pathname === '/') return null

  return (
    <nav className="bg-coffee-50 border-b border-coffee-200 py-3">
      <div className="container mx-auto px-4">
        <ol className="flex items-center gap-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-coffee-400" />
              )}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="text-coffee-600 hover:text-coffee-800 transition-colors flex items-center gap-1"
                >
                  {index === 0 && <Home className="w-4 h-4" />}
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-coffee-900 font-semibold flex items-center gap-1">
                  {index === 0 && <Home className="w-4 h-4" />}
                  {crumb.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}


