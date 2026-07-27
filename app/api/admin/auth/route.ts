import { NextRequest, NextResponse } from 'next/server'
import { createAdminSession, SESSION_COOKIE } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { password } = body

  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) {
    return NextResponse.json(
      { error: 'ADMIN_PASSWORD 환경변수가 설정되지 않았습니다.' },
      { status: 500 }
    )
  }

  if (password !== adminPassword) {
    return NextResponse.json(
      { error: '비밀번호가 올바르지 않습니다.' },
      { status: 401 }
    )
  }

  const token = await createAdminSession()

  const response = NextResponse.json({ success: true })
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8시간
    path: '/',
  })

  return response
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete(SESSION_COOKIE)
  return response
}
