import RegisterPage from '@/modules/auth/pages/RegisterPage'
import { AuthLayout } from '@/modules/auth/layouts/AuthLayout'

export default function Register() {
    return (
        <AuthLayout>
            <RegisterPage />
        </AuthLayout>
    )
}
