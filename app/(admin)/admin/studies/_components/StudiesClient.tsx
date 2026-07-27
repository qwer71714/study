'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

interface Study {
  id: string
  title: string
  category: string
  status: string
  isOnline: boolean
  maxMembers: number
  createdAt: Date
  owner: { id: string; nickname: string; email: string }
  _count: { members: number }
}

interface Props {
  studies: Study[]
  status: string
}

const STATUS_OPTIONS = [
  { value: 'ALL', label: '전체' },
  { value: 'PENDING', label: '승인 대기' },
  { value: 'ACTIVE', label: '운영 중' },
  { value: 'CLOSED', label: '종료' },
  { value: 'REJECTED', label: '거절됨' },
]

const statusBadge: Record<string, { label: string; cls: string }> = {
  PENDING: { label: '승인 대기', cls: 'badge-pending' },
  ACTIVE: { label: '운영 중', cls: 'badge-active' },
  CLOSED: { label: '종료', cls: 'badge-suspended' },
  REJECTED: { label: '거절', cls: 'badge-banned' },
}

const categoryLabel: Record<string, string> = {
  PROGRAMMING: '프로그래밍',
  LANGUAGE: '어학',
  CERTIFICATE: '자격증',
  DESIGN: '디자인',
  STARTUP: '창업',
  OTHER: '기타',
}

export default function StudiesClient({ studies, status }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function filterByStatus(s: string) {
    const params = s && s !== 'ALL' ? `?status=${s}` : ''
    startTransition(() => router.push(`/admin/studies${params}`))
  }

  async function updateStudyStatus(studyId: string, newStatus: string) {
    await fetch(`/api/admin/studies/${studyId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    startTransition(() => router.refresh())
  }

  const pendingCount = studies.filter((s) => s.status === 'PENDING').length

  return (
    <div className="admin-page">
      {/* 상단 알림 — 승인 대기 건이 있을 때 */}
      {pendingCount > 0 && (
        <div className="alert-banner" id="pending-alert">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          승인 대기 중인 스터디가 <strong>{pendingCount}개</strong> 있습니다.
        </div>
      )}

      {/* 필터 */}
      <div className="filter-bar">
        <div className="filter-tabs">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              id={`study-filter-${opt.value.toLowerCase()}`}
              onClick={() => filterByStatus(opt.value)}
              className={`filter-tab ${status === opt.value || (opt.value === 'ALL' && !status) ? 'active' : ''}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="filter-count">
          {isPending ? '조회 중...' : `총 ${studies.length}개`}
        </div>
      </div>

      {/* 테이블 */}
      <div className="table-card">
        <table className="admin-table" id="studies-table">
          <thead>
            <tr>
              <th>제목</th>
              <th>카테고리</th>
              <th>개설자</th>
              <th>형태</th>
              <th>멤버</th>
              <th>상태</th>
              <th>개설일</th>
              <th>액션</th>
            </tr>
          </thead>
          <tbody>
            {studies.length === 0 ? (
              <tr>
                <td colSpan={8} className="table-empty">해당하는 스터디가 없습니다</td>
              </tr>
            ) : (
              studies.map((study) => {
                const badge = statusBadge[study.status] ?? { label: study.status, cls: '' }
                return (
                  <tr key={study.id}>
                    <td className="table-title">{study.title}</td>
                    <td>{categoryLabel[study.category] ?? study.category}</td>
                    <td className="table-nickname">{study.owner.nickname}</td>
                    <td>
                      <span className={`badge ${study.isOnline ? 'badge-online' : 'badge-offline'}`}>
                        {study.isOnline ? '온라인' : '오프라인'}
                      </span>
                    </td>
                    <td className="table-center">
                      {study._count.members}/{study.maxMembers}
                    </td>
                    <td><span className={`badge ${badge.cls}`}>{badge.label}</span></td>
                    <td className="table-date">
                      {new Date(study.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="action-cell">
                      {study.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => updateStudyStatus(study.id, 'ACTIVE')}
                            className="action-btn action-activate"
                            id={`approve-study-${study.id}`}
                          >
                            승인
                          </button>
                          <button
                            onClick={() => updateStudyStatus(study.id, 'REJECTED')}
                            className="action-btn action-suspend"
                            id={`reject-study-${study.id}`}
                          >
                            거절
                          </button>
                        </>
                      )}
                      {study.status === 'ACTIVE' && (
                        <button
                          onClick={() => updateStudyStatus(study.id, 'CLOSED')}
                          className="action-btn action-suspend"
                          id={`close-study-${study.id}`}
                        >
                          종료
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
