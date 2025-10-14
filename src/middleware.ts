import { NextRequest, NextResponse } from 'next/server'

/**
 * Middleware to protect import routes with PayloadCMS authentication
 * Only authenticated PayloadCMS users can access /import/* routes
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect import routes
  if (pathname.startsWith('/import')) {
    // Get the payload-token from cookies
    const token = request.cookies.get('payload-token')?.value

    if (!token) {
      // No token found, redirect to admin login
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Token exists, ensure a CSRF token cookie is set (double-submit pattern)
    const csrfCookie = request.cookies.get('csrf-token')?.value
    const csrfToken = csrfCookie || (globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `${Date.now()}-${Math.random()}`)
    const response = NextResponse.next()
    if (!csrfCookie) {
      response.cookies.set('csrf-token', csrfToken, {
        httpOnly: false, // must be readable by client JS to echo in header
        secure: true,
        sameSite: 'strict',
        path: '/',
      })
    }
    return response
  }

  // For API routes, check authentication headers
  if (pathname.startsWith('/api/franchises/import')) {
    // Only allow POST for this route
    if (request.method !== 'POST') {
      return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
    }

    // Check for payload-token cookie or Authorization header
    const token = request.cookies.get('payload-token')?.value || 
                 request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Enforce same-origin for CSRF protection
    const expectedOrigin = request.nextUrl.origin
    const originHeader = request.headers.get('origin') || ''
    const refererHeader = request.headers.get('referer') || ''
    const isSameOrigin = originHeader === expectedOrigin || refererHeader.startsWith(expectedOrigin)
    if (!isSameOrigin) {
      return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
    }

    // CSRF validation: require header to match cookie when using cookie-based auth
    const authHeader = request.headers.get('authorization')
    const csrfCookie = request.cookies.get('csrf-token')?.value
    const csrfHeader = request.headers.get('x-csrf-token')
    if (!authHeader) {
      if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
        return NextResponse.json({ error: 'CSRF validation failed' }, { status: 403 })
      }
    }

    // Token and CSRF checks passed; continue to the route for detailed verification
    return NextResponse.next()
  }

  // Allow all other routes
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/import/:path*',
    '/api/franchises/import/:path*'
  ]
}