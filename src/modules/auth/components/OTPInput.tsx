'use client'

import React, { useRef, useEffect, useState } from 'react'


interface OTPInputProps {
  length?: number
  onComplete: (otp: string) => void
  onChange?: (otp: string) => void
  error?: string
  disabled?: boolean
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  onComplete,
  onChange,
  error,
  disabled,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    const otpString = newOtp.join('')
    if (onChange) {
      onChange(otpString)
    }

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    if (newOtp.every((digit) => digit !== '')) {
      onComplete(otpString)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, length).split('')
    if (pastedData.every((char) => /^\d$/.test(char))) {
      const newOtp = [...otp]
      pastedData.forEach((char, index) => {
        if (index < length) {
          newOtp[index] = char
        }
      })
      setOtp(newOtp)
      const otpString = newOtp.join('')
      if (onChange) {
        onChange(otpString)
      }
      if (newOtp.every((digit) => digit !== '')) {
        onComplete(otpString)
      }
    }
  }

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  return (
    <div>
      <label className="block text-sm font-medium text-coffee-700 mb-2">
        Enter OTP
      </label>
      <div className="flex gap-2 justify-center">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={otp[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className={`
              w-12 h-12 text-center text-lg font-semibold
              border-2 rounded-lg transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-coffee-500
              bg-white text-coffee-900
              border-coffee-300
              ${error ? 'border-red-500 focus:ring-red-500' : ''}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          />
        ))}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 text-center animate-shake">
          {error}
        </p>
      )}
    </div>
  )
}

