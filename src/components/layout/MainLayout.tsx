'use client'

import React, { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { ShoppingCart, User, LogOut, Home } from 'lucide-react'
import { Button } from '../ui/Button'
import { useCartStore } from '@/store/cart.store'
import { Breadcrumbs } from '../ui/Breadcrumbs'
import Link from 'next/link'

interface MainLayoutProps {
  children: React.ReactNode
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated, init, clearAuth } = useAuthStore()
  const itemCount = useCartStore((state) => state.getItemCount())

  useEffect(() => {
    init()
  }, [init])

  const handleLogout = () => {
    clearAuth()
    router.push('/')
  }

  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/verify-otp')
  const isAdminPage = pathname?.startsWith('/admin')

  if (isAuthPage || isAdminPage) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-md sticky top-0 z-50 border-b border-coffee-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-coffee-700 hover:text-coffee-800 transition-colors">
              GV Natural
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className={`hover:text-coffee-700 transition-colors ${
                  pathname === '/' ? 'text-coffee-700 font-semibold' : 'text-coffee-600'
                }`}
              >
                <Home className="w-5 h-5" />
              </Link>
              <Link
                href="/products"
                className={`hover:text-coffee-700 transition-colors ${
                  pathname === '/products' ? 'text-coffee-700 font-semibold' : 'text-coffee-600'
                }`}
              >
                Products
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              {/* <ThemeToggle /> */}

              {isAuthenticated ? (
                <>
                  <Link href="/cart" className="relative text-coffee-700 hover:text-coffee-800">
                    <ShoppingCart className="w-6 h-6" />
                    {itemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-coffee-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </Link>

                  <Link href="/profile" className="flex items-center gap-2 text-coffee-700 hover:text-coffee-800">
                    <User className="w-5 h-5" />
                    <span className="hidden md:block">{user?.name}</span>
                  </Link>

                  <Link href="/orders" className="hidden md:block text-coffee-700 hover:text-coffee-800">
                    Orders
                  </Link>

                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Link href="/login">
                  <Button variant="primary" size="sm">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <Breadcrumbs />

      <main>{children}</main>

      <footer className="bg-coffee-900 text-coffee-100 border-t border-coffee-800 mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">GV Natural</h3>
              <p className="text-coffee-300 text-sm">
                Premium organic products for your healthy lifestyle.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="text-coffee-300 hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/products" className="text-coffee-300 hover:text-white transition-colors">Products</Link></li>
                <li><Link href="/about" className="text-coffee-300 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="text-coffee-300 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Products</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/products?category=gud" className="text-coffee-300 hover:text-white transition-colors">Gud (Jaggery)</Link></li>
                <li><Link href="/products?category=shakkar" className="text-coffee-300 hover:text-white transition-colors">Shakkar</Link></li>
                <li><Link href="/products?category=chini" className="text-coffee-300 hover:text-white transition-colors">Chini</Link></li>
                <li><Link href="/products?category=chawal" className="text-coffee-300 hover:text-white transition-colors">Desi Basmati Chawal</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-coffee-300">
                <li>Email: info@gvnatural.com</li>
                <li>Phone: +91 1234567890</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-coffee-800 pt-8 text-center text-sm text-coffee-400">
            <p>&copy; 2024 GV Natural. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

