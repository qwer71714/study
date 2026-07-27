import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const SESSION_COOKIE = 'admin_session'
const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? 'fallback-secret-change-me'
)

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // /admin 경로 보호 (로그인 페이지 제외)
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get(SESSION_COOKIE)?.value

    if (!token) {
      return NextResponse.redirect(new URL('/admin-login', request.url))
    }

    try {
      await jwtVerify(token, SECRET)
      return NextResponse.next()
    } catch {
      // 토큰 만료 또는 잘못된 토큰
      const response = NextResponse.redirect(new URL('/admin-login', request.url))
      response.cookies.delete(SESSION_COOKIE)
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
