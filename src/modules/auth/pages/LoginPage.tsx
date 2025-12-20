'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { PhoneInput } from '../components/PhoneInput'
import { Button } from '@/components/ui/Button'
import { authApi } from '@/lib/api/auth.api'
import { PHONE_REGEX } from '@/lib/utils/constants'
import { ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Redirect admin to dashboard if already logged in
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.type === 'admin') {
      router.push('/admin/dashboard')
    }
  }, [status, session, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!phone) {
      setError('Phone number is required')
      return
    }

    const phoneNumber = phone.replace(/\s/g, '')
    if (!PHONE_REGEX.test(phoneNumber)) {
      setError('Please enter a valid Indian phone number (+91XXXXXXXXXX)')
      return
    }

    setIsLoading(true)
    try {
      const response = await authApi.sendOtp({ phone: phoneNumber })
      toast.success(response.message || 'OTP sent successfully')
      router.push(`/verify-otp?phone=${encodeURIComponent(phoneNumber)}`)
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to send OTP'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to GV Natural</h1>
        <p className="text-coffee-600">
          Enter your phone number to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <PhoneInput
          value={phone}
          onChange={setPhone}
          error={error}
          disabled={isLoading}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full"
        >
          Send OTP
        </Button>
      </form>

      <div className="flex justify-center mt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-coffee-700 hover:text-coffee-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
      </div>
    </div>
  )
}


