import { Suspense } from 'react'
import VerifyOtpPage from '@/modules/auth/pages/VerifyOtpPage'
import { AuthLayout } from '@/modules/auth/layouts/AuthLayout'

function VerifyOtpContent() {
  return (
    <AuthLayout>
      <VerifyOtpPage />
    </AuthLayout>
  )
}

export default function VerifyOtp() {
  return (
    <Suspense fallback={
      <AuthLayout>
        <div className="w-full">
          <div className="text-center mb-8">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-48 mx-auto animate-pulse" />
          </div>
        </div>
      </AuthLayout>
    }>
      <VerifyOtpContent />
    </Suspense>
  )
}

