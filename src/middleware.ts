import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Skip middleware for NextAuth API routes
  if (pathname.startsWith('/api/auth/')) {
    return NextResponse.next()
  }

  // Only protect admin routes (except login)
  // TEMPORARILY DISABLED - Let AdminLayout handle authentication
  // if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
  //   try {
  //     const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || 'gvnatural-admin-secret-key-change-in-production'
  //     
  //     // Try to get token - getToken should automatically find the cookie
  //     const token = await getToken({
  //       req,
  //       secret,
  //     })

  //     // Check if user is admin - token must exist and have type 'admin'
  //     const isAdmin = token && (token as any)?.type === 'admin'
  //     
  //     if (!isAdmin) {
  //       // In development, log for debugging
  //       if (process.env.NODE_ENV === 'development') {
  //         const allCookies = req.cookies.getAll()
  //         const sessionCookies = allCookies.filter(c => 
  //           c.name.includes('session') || c.name.includes('next-auth')
  //         )
  //         console.log('[Middleware] Admin check failed:', {
  //           pathname,
  //           hasToken: !!token,
  //           tokenType: token ? (token as any)?.type : 'no token',
  //           cookies: sessionCookies.map(c => c.name),
  //         })
  //       }
  //       return NextResponse.redirect(new URL('/admin/login', req.url))
  //     }
  //   } catch (error) {
  //     // If token retrieval fails, redirect to login
  //     if (process.env.NODE_ENV === 'development') {
  //       console.error('[Middleware] Token check error:', error)
  //     }
  //     return NextResponse.redirect(new URL('/admin/login', req.url))
  //   }
  // }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}

