import type { Metadata } from 'next'
import { db } from '@/lib/db'
import SessionsClient from './_components/SessionsClient'

export const metadata: Metadata = { title: '모각코 세션' }

async function getSessions(status: string) {
  return db.moGakCoSession.findMany({
    where: status && status !== 'ALL' ? { status: status as any } : {},
    orderBy: { scheduledAt: 'desc' },
    include: {
      owner: { select: { id: true, nickname: true } },
      _count: { select: { members: true } },
    },
  })
}

interface PageProps {
  searchParams: Promise<{ status?: string }>
}

export default async function SessionsPage({ searchParams }: PageProps) {
  const { status = 'ALL' } = await searchParams
  const sessions = await getSessions(status)
  return <SessionsClient sessions={sessions} status={status} />
}
