'use client'

import { AdminReportsProps } from '@/types/AdminTypes'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

const STATUS_OPTIONS = [
  { value: 'ALL', label: '전체' },
  { value: 'PENDING', label: '처리 대기' },
  { value: 'RESOLVED', label: '처리 완료' },
  { value: 'DISMISSED', label: '기각' },
]

const statusBadge: Record<string, { label: string; cls: string }> = {
  PENDING: { label: '처리 대기', cls: 'badge-pending' },
  RESOLVED: { label: '처리 완료', cls: 'badge-active' },
  DISMISSED: { label: '기각', cls: 'badge-banned' },
}

const targetTypeLabel: Record<string, string> = {
  user: '사용자',
  study: '스터디',
  session: '모각코',
}

export default function ReportsClient({ reports, status }: AdminReportsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function filterByStatus(s: string) {
    const params = s && s !== 'ALL' ? `?status=${s}` : ''
    startTransition(() => router.push(`/admin/reports${params}`))
  }

  async function updateReportStatus(reportId: string, newStatus: string) {
    await fetch(`/api/admin/reports/${reportId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    startTransition(() => router.refresh())
  }

  const pendingCount = reports.filter((r) => r.status === 'PENDING').length

  return (
    <div className="admin-page">
      {/* 상단 알림 — 처리 대기 신고가 있을 때 */}
      {pendingCount > 0 && (
        <div className="alert-banner" id="pending-reports-alert">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          처리 대기 중인 신고가 <strong>{pendingCount}건</strong> 있습니다.
        </div>
      )}

      {/* 필터 */}
      <div className="filter-bar">
        <div className="filter-tabs">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              id={`report-filter-${opt.value.toLowerCase()}`}
              onClick={() => filterByStatus(opt.value)}
              className={`filter-tab ${status === opt.value || (opt.value === 'ALL' && !status) ? 'active' : ''}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="filter-count">
          {isPending ? '조회 중...' : `총 ${reports.length}건`}
        </div>
      </div>

      {/* 테이블 */}
      <div className="table-card">
        <table className="admin-table" id="reports-table">
          <thead>
            <tr>
              <th>신고자</th>
              <th>이메일</th>
              <th>신고 대상</th>
              <th>신고 사유</th>
              <th>상태</th>
              <th>신고일</th>
              <th>액션</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan={7} className="table-empty">해당하는 신고가 없습니다</td>
              </tr>
            ) : (
              reports.map((report) => {
                const badge = statusBadge[report.status] ?? { label: report.status, cls: '' }
                return (
                  <tr key={report.id}>
                    <td className="table-nickname">{report.reporter.nickname}</td>
                    <td className="table-email">{report.reporter.email}</td>
                    <td>
                      <span className="badge badge-user">
                        {targetTypeLabel[report.targetType] ?? report.targetType}
                      </span>
                    </td>
                    <td className="table-reason">{report.reason}</td>
                    <td><span className={`badge ${badge.cls}`}>{badge.label}</span></td>
                    <td className="table-date">
                      {new Date(report.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="action-cell">
                      {report.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => updateReportStatus(report.id, 'RESOLVED')}
                            className="action-btn action-activate"
                            id={`resolve-report-${report.id}`}
                          >
                            처리
                          </button>
                          <button
                            onClick={() => updateReportStatus(report.id, 'DISMISSED')}
                            className="action-btn action-suspend"
                            id={`dismiss-report-${report.id}`}
                          >
                            기각
                          </button>
                        </>
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
