'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { MainLayout } from '@/components/layout/MainLayout'
import { HeroSection } from '@/components/landing/HeroSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { HeritageSection } from '@/components/landing/HeritageSection'
import { FeaturedProductsSection } from '@/components/landing/FeaturedProductsSection'
import { TestimonialsSectionNew } from '@/components/landing/TestimonialsSectionNew'
import { ContactSectionNew } from '@/components/landing/ContactSectionNew'
import ProductsPage from '@/modules/products/pages/ProductsPage'

export default function HomePage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    // Redirect admin users to admin dashboard
    if (status === 'authenticated' && session?.user?.type === 'admin') {
      router.push('/admin/dashboard')
    }
  }, [status, session, router])

  // Don't render landing page if admin is logged in (will redirect)
  if (status === 'authenticated' && session?.user?.type === 'admin') {
    return null
  }

  return (
    <MainLayout>
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section - 3 Cards */}
      <FeaturesSection />

      {/* Heritage Section */}
      <HeritageSection />

      {/* Featured Products Section */}
      <FeaturedProductsSection />

      {/* All Products Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-coffee-900 mb-4">
              Browse All Products
            </h2>
            <p className="text-xl text-coffee-600 max-w-2xl mx-auto">
              Explore our complete collection of premium organic products
          </p>
        </div>
        <ProductsPage />
      </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSectionNew />

      {/* Contact Section */}
      <ContactSectionNew />
    </MainLayout>
  )
}
