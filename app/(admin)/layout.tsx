import type { Metadata } from 'next'
import AdminSidebar from './_components/AdminSidebar'
import AdminHeader from './_components/AdminHeader'

export const metadata: Metadata = {
  title: {
    template: '%s | StudyMatch 어드민',
    default: 'StudyMatch 어드민',
  },
  description: '스터디/모각코 매칭 플랫폼 관리자 페이지',
  robots: { index: false, follow: false },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <main className="admin-content">{children}</main>
      </div>
    </div>
  )
}
