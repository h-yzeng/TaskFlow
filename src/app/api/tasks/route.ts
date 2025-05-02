import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';

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

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const taskId = params.id;
    const body = await request.json();
    
    console.log(`Updating task ${taskId} with:`, body);
    
    const updateFields: string[] = [];
    const values: (string | number | boolean | null)[] = []; 
    let paramCount = 1;
    
    const validFields = ['title', 'description', 'status', 'priority', 'due_date'];
    
    for (const field of validFields) {
      if (body[field] !== undefined) {
        updateFields.push(`${field} = $${paramCount}`);
        values.push(body[field]);
        paramCount++;
        console.log(`Adding field for update: ${field} = ${body[field]}`);
      }
    }
    
    updateFields.push(`updated_at = NOW()`);
    
    values.push(taskId);
    values.push(session.user.id);
    
    if (updateFields.length === 1) {
      console.log('No valid fields to update');
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }
    
    const updateQuery = `
      UPDATE tasks 
      SET ${updateFields.join(', ')} 
      WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
      RETURNING *
    `;
    
    console.log('Executing query:', updateQuery);
    console.log('With values:', values);
    
    const result = await executeQuery(updateQuery, values);
    
    if (result.rowCount === 0) {
      console.log('Task not found or not authorized');
      return NextResponse.json({ error: 'Task not found or not authorized' }, { status: 404 });
    }
    
    console.log('Task updated successfully:', result.rows[0]);
    
    return NextResponse.json({ task: result.rows[0] });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const taskId = params.id;
    const body = await request.json();
    
    console.log(`Updating task ${taskId} with:`, body);
    
    const updateFields: string[] = [];
    const values: (string | number | boolean | null)[] = []; 
    let paramCount = 1;
    
    const validFields = ['title', 'description', 'status', 'priority', 'due_date'];
    
    for (const field of validFields) {
      if (body[field] !== undefined) {
        updateFields.push(`${field} = $${paramCount}`);
        values.push(body[field]);
        paramCount++;
        console.log(`Adding field for update: ${field} = ${body[field]}`);
      }
    }
    
    updateFields.push(`updated_at = NOW()`);
    
    values.push(taskId);
    values.push(session.user.id);
    
    if (updateFields.length === 1) {
      console.log('No valid fields to update');
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }
    
    const updateQuery = `
      UPDATE tasks 
      SET ${updateFields.join(', ')} 
      WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
      RETURNING *
    `;
    
    console.log('Executing query:', updateQuery);
    console.log('With values:', values);
    
    const result = await executeQuery(updateQuery, values);
    
    if (result.rowCount === 0) {
      console.log('Task not found or not authorized');
      return NextResponse.json({ error: 'Task not found or not authorized' }, { status: 404 });
    }
    
    console.log('Task updated successfully:', result.rows[0]);
    
    return NextResponse.json({ task: result.rows[0] });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}