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

    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        image VARCHAR(255),
        github_id VARCHAR(255) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name = 'tasks' AND column_name = 'user_id'
        ) THEN
          ALTER TABLE tasks ADD COLUMN user_id INTEGER REFERENCES users(id);
        END IF;
      END $$;
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
    `;

    console.log('Database initialized');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}