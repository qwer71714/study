'use client'

import { AdminUsersProps } from '@/types/AdminTypes'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

const STATUS_OPTIONS = [
  { value: 'ALL', label: '전체' },
  { value: 'ACTIVE', label: '활성' },
  { value: 'SUSPENDED', label: '정지' },
  { value: 'BANNED', label: '차단' },
]

const statusBadge: Record<string, { label: string; cls: string }> = {
  ACTIVE: { label: '활성', cls: 'badge-active' },
  SUSPENDED: { label: '정지', cls: 'badge-suspended' },
  BANNED: { label: '차단', cls: 'badge-banned' },
}

const roleBadge: Record<string, { label: string; cls: string }> = {
  USER: { label: '일반', cls: 'badge-user' },
  ADMIN: { label: '어드민', cls: 'badge-admin' },
}

export default function UsersClient({ users, search, status }: AdminUsersProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams()
    if (key === 'search') {
      if (value) params.set('search', value)
      if (status && status !== 'ALL') params.set('status', status)
    } else {
      if (search) params.set('search', search)
      if (value && value !== 'ALL') params.set('status', value)
    }
    startTransition(() => {
      router.push(`/admin/users?${params.toString()}`)
    })
  }

  async function toggleStatus(userId: string, currentStatus: string) {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
    await fetch(`/api/admin/users/${userId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus }),
    })
    startTransition(() => router.refresh())
  }

  return (
    <div className="admin-page">
      {/* 필터 바 */}
      <div className="filter-bar">
        <div className="search-wrap">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            id="users-search"
            type="text"
            placeholder="닉네임 또는 이메일 검색..."
            defaultValue={search}
            className="search-input"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                updateFilter('search', (e.target as HTMLInputElement).value)
              }
            }}
          />
        </div>
        <div className="filter-tabs">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              id={`filter-${opt.value.toLowerCase()}`}
              onClick={() => updateFilter('status', opt.value)}
              className={`filter-tab ${status === opt.value || (opt.value === 'ALL' && !status) ? 'active' : ''}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="filter-count">
          {isPending ? '조회 중...' : `총 ${users.length}명`}
        </div>
      </div>

      {/* 테이블 */}
      <div className="table-card">
        <table className="admin-table" id="users-table">
          <thead>
            <tr>
              <th>닉네임</th>
              <th>이메일</th>
              <th>역할</th>
              <th>상태</th>
              <th>스터디</th>
              <th>모각코</th>
              <th>가입일</th>
              <th>액션</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={8} className="table-empty">검색 결과가 없습니다</td>
              </tr>
            ) : (
              users.map((user) => {
                const sb = statusBadge[user.status] ?? { label: user.status, cls: '' }
                const rb = roleBadge[user.role] ?? { label: user.role, cls: '' }
                return (
                  <tr key={user.id}>
                    <td className="table-nickname">{user.nickname}</td>
                    <td className="table-email">{user.email}</td>
                    <td><span className={`badge ${rb.cls}`}>{rb.label}</span></td>
                    <td><span className={`badge ${sb.cls}`}>{sb.label}</span></td>
                    <td className="table-center">{user._count.ownedStudies}</td>
                    <td className="table-center">{user._count.ownedSessions}</td>
                    <td className="table-date">
                      {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                    <td>
                      {user.role !== 'ADMIN' && (
                        <button
                          onClick={() => toggleStatus(user.id, user.status)}
                          className={`action-btn ${user.status === 'ACTIVE' ? 'action-suspend' : 'action-activate'}`}
                          id={`toggle-status-${user.id}`}
                        >
                          {user.status === 'ACTIVE' ? '정지' : '활성화'}
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
