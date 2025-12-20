import AdminLoginPage from '@/modules/admin/pages/AdminLoginPage'
import { AuthLayout } from '@/modules/auth/layouts/AuthLayout'

export default function AdminLogin() {
  return (
    <AuthLayout>
      <AdminLoginPage />
    </AuthLayout>
  )
}

