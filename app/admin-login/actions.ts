'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createAdminSession, SESSION_COOKIE } from '@/lib/admin-auth'

export async function adminLoginAction(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string }> {
  const password = formData.get('password') as string

  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) {
    return { error: 'ADMIN_PASSWORD 환경변수가 설정되지 않았습니다.' }
  }

  if (password !== adminPassword) {
    return { error: '비밀번호가 올바르지 않습니다.' }
  }

  const token = await createAdminSession()
  const cookieStore = await cookies()

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8시간
    path: '/',
  })

  redirect('/admin')
}
