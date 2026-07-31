'use client'

import { Stats } from "@/types/AdminTypes";

const statCards = (stats: Stats) => [
  {
    id: 'total-users',
    label: '전체 사용자',
    value: stats.totalUsers.toLocaleString(),
    sub: `활성 ${stats.activeUsers}명`,
    color: 'card-purple',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: 'pending-studies',
    label: '승인 대기 스터디',
    value: stats.pendingStudies.toLocaleString(),
    sub: `운영 중 ${stats.activeStudies}개`,
    color: 'card-indigo',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    id: 'total-sessions',
    label: '모각코 세션',
    value: stats.totalSessions.toLocaleString(),
    sub: '전체 세션 수',
    color: 'card-violet',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    id: 'pending-reports',
    label: '처리 대기 신고',
    value: stats.pendingReports.toLocaleString(),
    sub: '즉시 검토 필요',
    color: stats.pendingReports > 0 ? 'card-red' : 'card-green',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
]

const statusLabels: Record<string, { label: string; cls: string }> = {
  ACTIVE: { label: '활성', cls: 'badge-active' },
  SUSPENDED: { label: '정지', cls: 'badge-suspended' },
  BANNED: { label: '차단', cls: 'badge-banned' },
}

export default function DashboardClient({ stats }: { stats: Stats }) {
  return (
    <div className="dashboard">
      {/* 통계 카드 */}
      <section className="dashboard-section">
        <div className="stat-cards">
          {statCards(stats).map((card) => (
            <div key={card.id} className={`stat-card ${card.color}`} id={card.id}>
              <div className="stat-card-top">
                <div className="stat-card-icon">{card.icon}</div>
                <div className="stat-card-values">
                  <div className="stat-card-value">{card.value}</div>
                  <div className="stat-card-label">{card.label}</div>
                </div>
              </div>
              <div className="stat-card-sub">{card.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 최근 가입 사용자 */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">최근 가입 사용자</h2>
          <a href="/admin/users" className="section-link">전체 보기 →</a>
        </div>
        <div className="table-card">
          <table className="admin-table" id="recent-users-table">
            <thead>
              <tr>
                <th>닉네임</th>
                <th>이메일</th>
                <th>상태</th>
                <th>가입일</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="table-empty">가입한 사용자가 없습니다</td>
                </tr>
              ) : (
                stats.recentUsers.map((user) => {
                  const badge = statusLabels[user.status] ?? { label: user.status, cls: '' }
                  return (
                    <tr key={user.id}>
                      <td className="table-nickname">{user.nickname}</td>
                      <td className="table-email">{user.email}</td>
                      <td>
                        <span className={`badge ${badge.cls}`}>{badge.label}</span>
                      </td>
                      <td className="table-date">
                        {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
