import { neon } from "@neondatabase/serverless";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Create a lazy-loaded database connection
let _db: NeonHttpDatabase<typeof schema> | null = null;

function createDbConnection(): NeonHttpDatabase<typeof schema> {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL environment variable is not set. Please create a .env.local file with your Neon database URL. See .env.example for reference."
    );
  }
  const sql = neon(process.env.DATABASE_URL);
  return drizzle(sql, { schema });
}

// Export a getter that creates the connection lazily
export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
  get(target, prop: string | symbol) {
    if (!_db) {
      _db = createDbConnection();
    }
    return (_db as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export { schema };
