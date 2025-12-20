'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { PHONE_REGEX } from '@/lib/utils/constants'

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  error?: string
  disabled?: boolean
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  error,
  disabled,
}) => {
  const [focused, setFocused] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, '')
    
    if (input.length > 0 && !input.startsWith('91')) {
      input = '91' + input
    }
    
    if (input.length > 12) {
      input = input.slice(0, 12)
    }
    
    const formatted = input.length > 2 ? `+${input.slice(0, 2)} ${input.slice(2)}` : input ? `+${input}` : ''
    onChange(formatted)
  }

  return (
    <div className="relative">
      <Input
        type="tel"
        label="Phone Number"
        placeholder="+91 9876543210"
        value={value}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        error={error}
        disabled={disabled}
        className="pl-12"
        maxLength={14}
      />
      <div className="absolute left-4 top-9 text-coffee-500">
        🇮🇳
      </div>
    </div>
  )
}

