'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PhoneInput } from '../components/PhoneInput'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { authApi } from '@/lib/api/auth.api'
import { PHONE_REGEX } from '@/lib/utils/constants'
import { ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/auth.store'

export default function LoginPage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const { setAuth } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setError('')

    try {
      if (!phone) {
        setError('Phone number is required')
        return
      }

      if (!password) {
        setError('Password is required')
        return
      }

      // Clean phone number - remove all non-digit characters
      const phoneNumber = phone.replace(/\D/g, '')

      // Validate phone number is 10 digits
      if (phoneNumber.length !== 10) {
        setError('Phone number must be exactly 10 digits')
        return
      }

      setIsLoading(true)

      try {
        const response = await authApi.login({ phone: phoneNumber, password })

        if (response.data) {
          const { access_token, user } = response.data
          if (user) {
            setAuth(user, access_token)
            toast.success('Login successful!')
            router.push('/products')
          }
        }
      } catch (err: any) {
        console.error('Login error:', err)
        const errorMessage = err?.message || err?.error || 'Invalid credentials. Please try again.'
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full relative">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
        <p className="text-coffee-600">
          Login to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Phone Number"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={isLoading}
          required
        />

        <div className="space-y-1">
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-coffee-600 hover:text-coffee-800 hover:underline"
            >
              Forgot Password?
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

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

      <div className="flex flex-col items-center gap-4 mt-6">
        <Link
          href="/register"
          className="text-coffee-700 hover:text-coffee-900 transition-colors font-medium"
        >
          New user? Create an account
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-coffee-700 hover:text-coffee-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
      </div>

      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center space-y-4 animate-scale-in shadow-xl">
            <h3 className="text-xl font-bold text-coffee-900">Forgot Password?</h3>
            <p className="text-coffee-700">
              Please contact support to reset your password:
            </p>
            <div className="bg-coffee-50 p-3 rounded-md">
              <p className="text-lg font-mono font-bold text-coffee-800 select-all">
                +91 82220 73728
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => setShowForgotPassword(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}


