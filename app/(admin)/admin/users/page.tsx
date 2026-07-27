import type { Metadata } from 'next'
import { db } from '@/lib/db'
import UsersClient from './_components/UsersClient'

export const metadata: Metadata = { title: '사용자 관리' }

async function getUsers(search: string, status: string) {
  return db.user.findMany({
    where: {
      AND: [
        search
          ? {
              OR: [
                { nickname: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {},
        status && status !== 'ALL' ? { status: status as any } : {},
      ],
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      nickname: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      _count: {
        select: {
          ownedStudies: true,
          ownedSessions: true,
        },
      },
    },
  })
}

interface PageProps {
  searchParams: Promise<{ search?: string; status?: string }>
}

export default async function UsersPage({ searchParams }: PageProps) {
  const { search = '', status = 'ALL' } = await searchParams
  const users = await getUsers(search, status)
  return <UsersClient users={users} search={search} status={status} />
}
