import { NextRequest, NextResponse } from 'next/server'

import { db } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<'/api/admin/studies/[id]/status'>
) {
  const { id } = await ctx.params
  const { status } = await request.json()

  const validStatuses = ['PENDING', 'ACTIVE', 'CLOSED', 'REJECTED']
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: '유효하지 않은 상태값입니다.' }, { status: 400 })
  }

  const study = await db.study.update({
    where: { id },
    data: { status },
    select: { id: true, status: true },
  })

  return NextResponse.json(study)
}
