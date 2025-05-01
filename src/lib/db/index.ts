import { sql } from '@vercel/postgres';

export async function executeQuery(query: string, values: unknown[] = []) {
  try {
    const result = await sql.query(query, values);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function initializeDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        priority VARCHAR(50) DEFAULT 'medium',
        due_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('Database initialized');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}