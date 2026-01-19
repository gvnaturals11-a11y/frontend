'use client'

import React, { useId, forwardRef } from 'react'
import { cn } from '@/lib/utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  className,
  id,
  ...props
}, ref) => {
  const generatedId = useId()
  const inputId = id || generatedId

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-white-700 mb-1"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          'w-full px-4 py-2 border rounded-lg transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent',
          'bg-white text-black-900',
          'border-coffee-300',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400 animate-shake">
          {error}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

