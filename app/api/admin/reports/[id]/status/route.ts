import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<'/api/admin/reports/[id]/status'>
) {
  const { id } = await ctx.params
  const { status } = await request.json()

  const validStatuses = ['PENDING', 'RESOLVED', 'DISMISSED']
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: '유효하지 않은 상태값입니다.' }, { status: 400 })
  }

  const report = await db.report.update({
    where: { id },
    data: { status },
    select: { id: true, status: true },
  })

  return NextResponse.json(report)
}
