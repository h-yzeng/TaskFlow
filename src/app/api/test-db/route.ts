import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    const result = await sql`SELECT NOW()`;
    return NextResponse.json({ 
      message: 'Database connection successful',
      timestamp: result.rows[0].now 
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ 
      error: 'Failed to connect to database',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}