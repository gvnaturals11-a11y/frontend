import LoginPage from '@/modules/auth/pages/LoginPage'
import { AuthLayout } from '@/modules/auth/layouts/AuthLayout'

export default function Login() {
  return (
    <AuthLayout>
      <LoginPage />
    </AuthLayout>
  )
}

