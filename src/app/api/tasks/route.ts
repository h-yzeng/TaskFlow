import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const result = await executeQuery(
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
      [session.user.id]
    );

    return NextResponse.json({ tasks: result.rows });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    
    if (!body.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    
    const result = await executeQuery(
      'INSERT INTO tasks (title, description, status, priority, due_date, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [
        body.title,
        body.description || null,
        body.status || 'pending',
        body.priority || 'medium',
        body.due_date || null,
        session.user.id
      ]
    );

    return NextResponse.json({ task: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}