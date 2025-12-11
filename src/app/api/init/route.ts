import { NextResponse } from "next/server";

// Database initialization is now handled via Drizzle migrations
// Run `npx drizzle-kit push` to sync schema with database
export async function GET() {
  return NextResponse.json({
    message:
      "Database schema is managed by Drizzle ORM. Run `npx drizzle-kit push` to sync schema.",
    docs: "https://orm.drizzle.team/docs/migrations",
  });
}
