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

    // Token exists, allow access (detailed validation will happen in the API route)
    return NextResponse.next()
  }

  // For API routes, check authentication headers
  if (pathname.startsWith('/api/franchises/import')) {
    // Check for payload-token cookie or Authorization header
    const token = request.cookies.get('payload-token')?.value || 
                 request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Token exists, allow access (detailed validation will happen in the API route)
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