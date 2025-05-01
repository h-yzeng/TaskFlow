import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const result = await executeQuery('SELECT * FROM tasks WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    return NextResponse.json({ task: result.rows[0] });
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const { title, description, status, priority, due_date } = await request.json();
    
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    
    const result = await executeQuery(
      `UPDATE tasks SET 
         title = $1, 
         description = $2, 
         status = $3, 
         priority = $4, 
         due_date = $5,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [title, description, status, priority, due_date, id]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    return NextResponse.json({ task: result.rows[0] });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const result = await executeQuery('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}