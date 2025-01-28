import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AUTH_TOKEN_KEY } from '@/lib/auth'

// Add routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/notes',
]

// Add routes that are only accessible to non-authenticated users
const authRoutes = [
  '/auth/login',
  '/auth/register',
  
]

export function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_TOKEN_KEY)
  const { pathname } = request.nextUrl

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  // Check if the route is auth-only (login/register)
  const isAuthRoute = authRoutes.some(route => pathname === route)

  // If the route is protected and user is not authenticated
  if (isProtectedRoute && !token) {
    const response = NextResponse.redirect(new URL('/auth/login', request.url))
    return response
  }

  // If user is authenticated and tries to access auth routes
  if (isAuthRoute && token) {
    const response = NextResponse.redirect(new URL('/dashboard', request.url))
    return response
  }

  return NextResponse.next()
}

// Configure paths that should trigger the middleware
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api (API routes)
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. /_vercel (Vercel internals)
     * 5. /favicon.ico, /sitemap.xml (static files)
     */
    '/((?!api|_next|_static|_vercel|favicon.ico|sitemap.xml).*)',
  ],
} 