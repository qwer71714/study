import type { Metadata } from 'next'
import { db } from '@/lib/db'
import DashboardClient from './_components/DashboardClient'

export const metadata: Metadata = {
  title: '대시보드',
}

async function getStats() {
  const [
    totalUsers,
    activeUsers,
    pendingStudies,
    activeStudies,
    totalSessions,
    pendingReports,
    recentUsers,
  ] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { status: 'ACTIVE' } }),
    db.study.count({ where: { status: 'PENDING' } }),
    db.study.count({ where: { status: 'ACTIVE' } }),
    db.moGakCoSession.count(),
    db.report.count({ where: { status: 'PENDING' } }),
    db.user.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        nickname: true,
        email: true,
        status: true,
        createdAt: true,
      },
    }),
  ])

  return {
    totalUsers,
    activeUsers,
    pendingStudies,
    activeStudies,
    totalSessions,
    pendingReports,
    recentUsers,
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats()

  return <DashboardClient stats={stats} />
}
