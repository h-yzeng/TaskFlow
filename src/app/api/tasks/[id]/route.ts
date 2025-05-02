import { NextResponse } from 'next/server'
import { executeQuery }  from '@/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions }     from '../../auth/[...nextauth]/options'

export async function GET(
  request: Request,
  context: any     
) {

  const { id } = (context.params as { id: string })

  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await executeQuery(
    'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
    [id, session.user.id]
  )
  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  }
  return NextResponse.json({ task: result.rows[0] })
}

export async function PUT(
  request: Request,
  context: any
) {
  const { id } = (context.params as { id: string })
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const check = await executeQuery(
    'SELECT 1 FROM tasks WHERE id = $1 AND user_id = $2',
    [id, session.user.id]
  )
  if (check.rows.length === 0) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  }

  const result = await executeQuery(
    `UPDATE tasks
        SET title       = $1,
            description = $2,
            status      = $3,
            priority    = $4,
            due_date    = $5
      WHERE id = $6 AND user_id = $7
      RETURNING *`,
    [
      body.title,
      body.description || null,
      body.status      || 'pending',
      body.priority    || 'medium',
      body.due_date    || null,
      id,
      session.user.id,
    ]
  )
  return NextResponse.json({ task: result.rows[0] })
}

export async function DELETE(
  request: Request,
  context: any
) {
  const { id } = (context.params as { id: string })
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await executeQuery(
    'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
    [id, session.user.id]
  )
  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}
