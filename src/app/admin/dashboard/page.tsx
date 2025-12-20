import AdminDashboardPage from '@/modules/admin/pages/AdminDashboardPage'
import { AdminLayout } from '@/modules/admin/layouts/AdminLayout'

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <AdminDashboardPage />
    </AdminLayout>
  )
}

