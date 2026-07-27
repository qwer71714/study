'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await res.json()

      if (res.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        setError(data.error ?? '로그인에 실패했습니다.')
      }
    } catch {
      setError('서버 연결에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-bg">
      {/* 배경 장식 */}
      <div className="admin-login-glow glow-1" />
      <div className="admin-login-glow glow-2" />

      <div className="admin-login-card">
        {/* 로고 */}
        <div className="admin-login-logo">
          <div className="admin-login-logo-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="admin-login-logo-text">StudyMatch</span>
        </div>

        <div className="admin-login-header">
          <h1 className="admin-login-title">어드민 로그인</h1>
          <p className="admin-login-subtitle">관리자 전용 페이지입니다</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              관리자 비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="form-input"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="form-error" role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="form-submit-btn"
          >
            {loading ? (
              <span className="btn-loading">
                <span className="spinner" />
                로그인 중...
              </span>
            ) : (
              '로그인'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
