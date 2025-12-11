import { NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { auth } from "@/lib/auth";
import { eq, and, sql, lt, gte } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    // Get total task count
    const [totalResult] = await db
      .select({
        count: sql<number>`count(*)::int`,
      })
      .from(schema.tasks)
      .where(eq(schema.tasks.userId, userId));

    // Get completed task count
    const [completedResult] = await db
      .select({
        count: sql<number>`count(*)::int`,
      })
      .from(schema.tasks)
      .where(
        and(eq(schema.tasks.userId, userId), eq(schema.tasks.completed, true))
      );

    // Get overdue count (not completed and due date in past)
    const [overdueResult] = await db
      .select({
        count: sql<number>`count(*)::int`,
      })
      .from(schema.tasks)
      .where(
        and(
          eq(schema.tasks.userId, userId),
          eq(schema.tasks.completed, false),
          lt(schema.tasks.dueDate, now)
        )
      );

    // Get due today count
    const [dueTodayResult] = await db
      .select({
        count: sql<number>`count(*)::int`,
      })
      .from(schema.tasks)
      .where(
        and(
          eq(schema.tasks.userId, userId),
          eq(schema.tasks.completed, false),
          gte(schema.tasks.dueDate, todayStart),
          lt(schema.tasks.dueDate, todayEnd)
        )
      );

    const total = totalResult?.count || 0;
    const completed = completedResult?.count || 0;

    const stats = {
      total,
      completed,
      pending: total - completed,
      overdue: overdueResult?.count || 0,
      dueToday: dueTodayResult?.count || 0,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
