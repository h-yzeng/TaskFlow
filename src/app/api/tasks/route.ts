import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

type RouteContext = { params: Promise<Record<string, string | string[]>> };

export async function GET(
  request: NextRequest,
  context: RouteContext
) {

  void request;
  await context.params;

  try {
    const result = await executeQuery(
      `SELECT * FROM tasks ORDER BY created_at DESC`
    );
    return NextResponse.json({ tasks: result.rows });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: RouteContext
) {

  void context;

  try {
    const { title, description, status, priority, due_date } =
      await request.json();
    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const result = await executeQuery(
      `INSERT INTO tasks
         (title, description, status, priority, due_date)
       VALUES
         ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, description, status || "pending", priority || "medium", due_date]
    );

    return NextResponse.json({ task: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
