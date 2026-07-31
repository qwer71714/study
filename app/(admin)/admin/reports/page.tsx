import type { Metadata } from 'next'
import { db } from '@/lib/db'
import ReportsClient from './_components/ReportsClient'

export const metadata: Metadata = { title: '신고 관리' }

async function getReports(status: string) {
  return db.report.findMany({
    where: status && status !== 'ALL' ? { status: status as any } : {},
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      reason: true,
      targetType: true,
      targetId: true,
      status: true,
      createdAt: true,
      reporter: {
        select: { id: true, nickname: true, email: true },
      },
    },
  })
}

interface PageProps {
  searchParams: Promise<{ status?: string }>
}

export default async function ReportsPage({ searchParams }: PageProps) {
  const { status = 'ALL' } = await searchParams
  const reports = await getReports(status)
  return <ReportsClient reports={reports} status={status} />
}
