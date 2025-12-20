'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { ShippingAddress } from '@/types/order.types'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface ShippingFormProps {
  onSubmit: (data: ShippingAddress) => void
  isLoading?: boolean
  defaultValues?: Partial<ShippingAddress>
}

export const ShippingForm: React.FC<ShippingFormProps> = ({
  onSubmit,
  isLoading,
  defaultValues,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingAddress>({
    defaultValues: defaultValues || {
      country: 'India',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Full Name"
        {...register('name', { required: 'Name is required' })}
        error={errors.name?.message}
      />

      <Input
        label="Phone Number"
        type="tel"
        {...register('phone', {
          required: 'Phone is required',
          pattern: {
            value: /^\+91[0-9]{10}$/,
            message: 'Please enter a valid Indian phone number',
          },
        })}
        error={errors.phone?.message}
      />

      <Input
        label="Address Line 1"
        {...register('address_line1', { required: 'Address is required' })}
        error={errors.address_line1?.message}
      />

      <Input
        label="Address Line 2 (Optional)"
        {...register('address_line2')}
        error={errors.address_line2?.message}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="City"
          {...register('city', { required: 'City is required' })}
          error={errors.city?.message}
        />

        <Input
          label="State"
          {...register('state', { required: 'State is required' })}
          error={errors.state?.message}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Pincode"
          {...register('pincode', {
            required: 'Pincode is required',
            pattern: {
              value: /^[0-9]{6}$/,
              message: 'Pincode must be 6 digits',
            },
          })}
          error={errors.pincode?.message}
        />

        <Input
          label="Country"
          {...register('country', { required: 'Country is required' })}
          error={errors.country?.message}
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        className="w-full mt-6"
      >
        Place Order
      </Button>
    </form>
  )
}

