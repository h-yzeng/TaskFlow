import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    // Test database connection using Drizzle
    const result = await db.execute(sql`SELECT NOW() as now`);
    return NextResponse.json({
      message: "Database connection successful",
      timestamp: result.rows[0]?.now,
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      {
        error: "Failed to connect to database",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
