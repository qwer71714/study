'use client'

import { usePathname } from 'next/navigation'

const pageTitles: Record<string, string> = {
  '/admin': '대시보드',
  '/admin/users': '사용자 관리',
  '/admin/studies': '스터디 관리',
  '/admin/sessions': '모각코 세션',
  '/admin/reports': '신고 관리',
}

function getTitle(pathname: string): string {
  // 정확 매칭 먼저
  if (pageTitles[pathname]) return pageTitles[pathname]
  // 시작 매칭
  const match = Object.entries(pageTitles).find(
    ([key]) => key !== '/admin' && pathname.startsWith(key)
  )
  return match ? match[1] : '어드민'
}

export default function AdminHeader() {
  const pathname = usePathname()
  const title = getTitle(pathname)
  const now = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <h1 className="admin-header-title">{title}</h1>
        <p className="admin-header-date">{now}</p>
      </div>
      <div className="admin-header-right">
        <div className="admin-badge">
          <span className="admin-badge-dot" />
          관리자
        </div>
      </div>
    </header>
  )
}
