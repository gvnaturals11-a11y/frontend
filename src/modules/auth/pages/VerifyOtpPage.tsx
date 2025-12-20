'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { OTPInput } from '../components/OTPInput'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { authApi } from '@/lib/api/auth.api'
import { useAuthStore } from '@/store/auth.store'
import { OTP_RESEND_COOLDOWN } from '@/lib/utils/constants'
import toast from 'react-hot-toast'

export default function VerifyOtpPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const phone = searchParams.get('phone') || ''
  
  const [otp, setOtp] = useState('')
  const [name, setName] = useState('')
  const [showNameInput, setShowNameInput] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const { setAuth } = useAuthStore()

  useEffect(() => {
    if (!phone) {
      router.push('/login')
    }
  }, [phone, router])

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleOtpComplete = async (completedOtp: string) => {
    setOtp(completedOtp)
    setError('')
    setIsLoading(true)

    try {
      const response = await authApi.verifyOtp({
        phone,
        otp: completedOtp,
        name: showNameInput ? name : undefined,
      })

      if (response.data) {
        const { access_token, user } = response.data
        if (user) {
          setAuth(user, access_token)
          toast.success('Login successful!')
          router.push('/products')
        } else if (response.data.admin) {
          toast.error('Please use admin login')
          router.push('/admin/login')
        }
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Invalid OTP'
      setError(errorMessage)
      
      if (errorMessage.includes('name') || errorMessage.includes('Name')) {
        setShowNameInput(true)
      }
      
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return

    setIsLoading(true)
    try {
      const response = await authApi.sendOtp({ phone })
      toast.success(response.message || 'OTP resent successfully')
      setResendCooldown(OTP_RESEND_COOLDOWN)
    } catch (err: any) {
      toast.error(err?.message || 'Failed to resend OTP')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Verify OTP</h1>
        <p className="text-coffee-600">
          Enter the 6-digit code sent to {phone}
        </p>
      </div>

      <div className="space-y-6">
        <OTPInput
          onComplete={handleOtpComplete}
          error={error}
          disabled={isLoading}
        />

        {showNameInput && (
          <div className="animate-slide-in">
            <Input
              label="Full Name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
        )}

        <div className="text-center">
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resendCooldown > 0 || isLoading}
            className="text-sm text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resendCooldown > 0
              ? `Resend OTP in ${resendCooldown}s`
              : 'Resend OTP'}
          </button>
        </div>
      </div>
    </div>
  )
}


