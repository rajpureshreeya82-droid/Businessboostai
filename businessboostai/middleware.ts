import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Protected routes
  const protectedRoutes = ['/dashboard', '/chat', '/calendar', '/finance']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  // Auth routes (should redirect to dashboard if already logged in)
  const authRoutes = ['/Login', '/register']
  const isAuthRoute = authRoutes.includes(pathname)
  
  // Get token from cookies (simplified check)
  const token = request.cookies.get('next-auth.session-token') || request.cookies.get('__Secure-next-auth.session-token')
  
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/Login', request.url))
  }
  
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}