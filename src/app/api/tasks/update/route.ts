import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/options';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const taskId = body.id;
    
    if (!taskId) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }
    
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

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const taskId = body.id;
    
    if (!taskId) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }
    
    console.log(`Deleting task ${taskId}`);
    
    // Execute the delete query
    const result = await executeQuery(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
      [taskId, session.user.id]
    );
    
    // Check if any rows were affected
    if (result.rowCount === 0) {
      console.log('Task not found or not authorized to delete');
      return NextResponse.json({ error: 'Task not found or not authorized' }, { status: 404 });
    }
    
    console.log(`Task ${taskId} deleted successfully`);
    return NextResponse.json({ success: true, id: taskId });
    
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}