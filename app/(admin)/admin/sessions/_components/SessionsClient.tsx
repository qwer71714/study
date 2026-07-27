'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

interface Session {
  id: string
  title: string
  location: string
  isOnline: boolean
  maxMembers: number
  status: string
  scheduledAt: Date
  owner: { id: string; nickname: string }
  _count: { members: number }
}

interface Props {
  sessions: Session[]
  status: string
}

const STATUS_OPTIONS = [
  { value: 'ALL', label: '전체' },
  { value: 'SCHEDULED', label: '예정' },
  { value: 'ONGOING', label: '진행 중' },
  { value: 'COMPLETED', label: '완료' },
  { value: 'CANCELLED', label: '취소' },
]

const statusBadge: Record<string, { label: string; cls: string }> = {
  SCHEDULED: { label: '예정', cls: 'badge-pending' },
  ONGOING: { label: '진행 중', cls: 'badge-active' },
  COMPLETED: { label: '완료', cls: 'badge-user' },
  CANCELLED: { label: '취소', cls: 'badge-banned' },
}

export default function SessionsClient({ sessions, status }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function filterByStatus(s: string) {
    const params = s && s !== 'ALL' ? `?status=${s}` : ''
    startTransition(() => router.push(`/admin/sessions${params}`))
  }

  async function cancelSession(sessionId: string) {
    await fetch(`/api/admin/sessions/${sessionId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'CANCELLED' }),
    })
    startTransition(() => router.refresh())
  }

  return (
    <div className="admin-page">
      <div className="filter-bar">
        <div className="filter-tabs">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              id={`session-filter-${opt.value.toLowerCase()}`}
              onClick={() => filterByStatus(opt.value)}
              className={`filter-tab ${status === opt.value || (opt.value === 'ALL' && !status) ? 'active' : ''}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="filter-count">
          {isPending ? '조회 중...' : `총 ${sessions.length}개`}
        </div>
      </div>

      <div className="table-card">
        <table className="admin-table" id="sessions-table">
          <thead>
            <tr>
              <th>제목</th>
              <th>개설자</th>
              <th>장소</th>
              <th>형태</th>
              <th>참여</th>
              <th>상태</th>
              <th>예정일</th>
              <th>액션</th>
            </tr>
          </thead>
          <tbody>
            {sessions.length === 0 ? (
              <tr>
                <td colSpan={8} className="table-empty">해당하는 세션이 없습니다</td>
              </tr>
            ) : (
              sessions.map((session) => {
                const badge = statusBadge[session.status] ?? { label: session.status, cls: '' }
                return (
                  <tr key={session.id}>
                    <td className="table-title">{session.title}</td>
                    <td className="table-nickname">{session.owner.nickname}</td>
                    <td className="table-location">{session.location}</td>
                    <td>
                      <span className={`badge ${session.isOnline ? 'badge-online' : 'badge-offline'}`}>
                        {session.isOnline ? '온라인' : '오프라인'}
                      </span>
                    </td>
                    <td className="table-center">
                      {session._count.members}/{session.maxMembers}
                    </td>
                    <td><span className={`badge ${badge.cls}`}>{badge.label}</span></td>
                    <td className="table-date">
                      {new Date(session.scheduledAt).toLocaleString('ko-KR', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td>
                      {(session.status === 'SCHEDULED' || session.status === 'ONGOING') && (
                        <button
                          onClick={() => cancelSession(session.id)}
                          className="action-btn action-suspend"
                          id={`cancel-session-${session.id}`}
                        >
                          취소
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
