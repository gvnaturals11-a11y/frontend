'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { signIn, useSession } from 'next-auth/react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { AdminLoginRequest } from '@/types/auth.types'

export default function AdminLoginPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginRequest>()

  // Redirect if already logged in
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.type === 'admin') {
      router.push('/admin/dashboard')
    }
  }, [status, session, router])

  const onSubmit = async (data: AdminLoginRequest) => {
    setIsLoading(true)
    try {
      const result = await signIn('admin-credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: '/admin/dashboard',
      })

      if (result?.error) {
        toast.error(result.error || 'Login failed')
      } else if (result?.ok) {
        toast.success('Login successful!')
        // Wait a bit for session to be set
        await new Promise(resolve => setTimeout(resolve, 100))
        router.push('/admin/dashboard')
        router.refresh()
      }
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error(error?.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Login</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Enter your credentials to access the admin panel
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          type="email"
          label="Email"
          placeholder="admin@example.com"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          error={errors.email?.message}
        />

        <Input
          type="password"
          label="Password"
          placeholder="Enter your password"
          {...register('password', { required: 'Password is required' })}
          error={errors.password?.message}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full"
        >
          Login
        </Button>
      </form>

      <div className="flex justify-center mt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-coffee-600 hover:text-coffee-800 dark:text-coffee-400 dark:hover:text-coffee-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  )
}

