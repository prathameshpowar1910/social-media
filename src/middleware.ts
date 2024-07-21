import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const rateLimit = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT = 10
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute in milliseconds

function getRateLimitResponse() {
  return new NextResponse('Rate limit exceeded', {
    status: 429,
    headers: { 'Content-Type': 'text/plain' }
  })
}

export function middleware(request: NextRequest) {

  // Apply rate limiting to /image/:path* routes
  if (request.nextUrl.pathname.startsWith('/image/')) {
    const ip = request.ip || 'unknown'
    const now = Date.now()
    const rateLimitInfo = rateLimit.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW }

    if (now > rateLimitInfo.resetTime) {
      rateLimitInfo.count = 1
      rateLimitInfo.resetTime = now + RATE_LIMIT_WINDOW
    } else {
      rateLimitInfo.count++
    }

    rateLimit.set(ip, rateLimitInfo)

    if (rateLimitInfo.count > RATE_LIMIT) {
      return getRateLimitResponse()
    }

    const response = NextResponse.next()
    response.headers.set('X-RateLimit-Limit', RATE_LIMIT.toString())
    response.headers.set('X-RateLimit-Remaining', (RATE_LIMIT - rateLimitInfo.count).toString())
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/image/:path*']
}