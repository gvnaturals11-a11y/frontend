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

export default function RegisterPage() {
    const router = useRouter()
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { setAuth } = useAuthStore()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!name.trim()) {
            setError('Full Name is required')
            return
        }

        if (!phone) {
            setError('Phone number is required')
            return
        }

        if (!password || password.length < 6) {
            setError('Password must be at least 6 characters')
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
            const response = await authApi.register({
                name: name.trim(),
                phone: phoneNumber,
                password
            })

            if (response.data) {
                const { access_token, user } = response.data
                if (user) {
                    setAuth(user, access_token)
                    toast.success('Registration successful!')
                    router.push('/products')
                }
            }
        } catch (err: any) {
            const errorMessage = err?.message || 'Registration failed'
            setError(errorMessage)
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Create Account</h1>
                <p className="text-coffee-600">
                    Sign up to get started
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                    required
                />

                <Input
                    label="Phone Number"
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isLoading}
                    required
                />

                <Input
                    label="Password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                />

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
                    Register
                </Button>
            </form>

            <div className="flex justify-center mt-6">
                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-coffee-700 hover:text-coffee-900 transition-colors"
                >
                    <span className="text-sm font-medium">Already have an account? Login</span>
                </Link>
            </div>
        </div>
    )
}
