import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import axios from 'axios'
import { API_BASE_URL } from '@/lib/utils/constants'
import { AdminLoginRequest } from '@/types/auth.types'

const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET

if (!secret) {
  throw new Error('NEXTAUTH_SECRET or AUTH_SECRET must be set in environment variables')
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin Credentials',
      id: 'admin-credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        try {
          // Direct API call to avoid circular dependency
          const response = await axios.post(
            `${API_BASE_URL}/admin/login`,
            {
              email: credentials.email,
              password: credentials.password,
            } as AdminLoginRequest
          )

          // Handle different response formats
          const adminData = response.data?.data?.admin || response.data?.admin
          const accessToken = response.data?.data?.access_token || response.data?.access_token

          if (adminData && accessToken) {
            return {
              id: adminData.id || adminData._id?.toString() || String(adminData.id),
              email: adminData.email,
              name: adminData.name,
              role: adminData.role,
              accessToken: accessToken,
              type: 'admin',
            }
          }

          console.error('Invalid response format:', response.data)
          return null
        } catch (error: any) {
          console.error('Admin login error:', error?.response?.data || error?.message)
          const errorMessage = 
            error?.response?.data?.message || 
            error?.response?.data?.error || 
            error?.message || 
            'Invalid credentials'
          throw new Error(errorMessage)
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.accessToken = user.accessToken
        token.type = user.type
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.type = token.type as string
        session.accessToken = token.accessToken as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // If admin is logging in, redirect to admin dashboard
      if (url.includes('/admin') || url === baseUrl || url === `${baseUrl}/`) {
        return `${baseUrl}/admin/dashboard`
      }
      // Allow relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`
      // Allow callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}/admin/dashboard`
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret,
  debug: process.env.NODE_ENV === 'development',
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

