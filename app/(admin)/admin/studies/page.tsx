import type { Metadata } from 'next'
import { db } from '@/lib/db'
import StudiesClient from './_components/StudiesClient'

export const metadata: Metadata = { title: '스터디 관리' }

async function getStudies(status: string) {
  return db.study.findMany({
    where: status && status !== 'ALL' ? { status: status as any } : {},
    orderBy: { createdAt: 'desc' },
    include: {
      owner: { select: { id: true, nickname: true, email: true } },
      _count: { select: { members: true } },
    },
  })
}

interface PageProps {
  searchParams: Promise<{ status?: string }>
}

export default async function StudiesPage({ searchParams }: PageProps) {
  const { status = 'ALL' } = await searchParams
  const studies = await getStudies(status)
  return <StudiesClient studies={studies} status={status} />
}
