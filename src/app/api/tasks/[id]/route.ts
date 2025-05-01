import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

type RouteContext = { params: Promise<{ id: string | string[] }> };

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  const { id } = await context.params;
  const taskId = Array.isArray(id) ? id[0] : id;
  const result = await executeQuery(
    "SELECT * FROM tasks WHERE id = $1",
    [taskId]
  );
  if (result.rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ task: result.rows[0] });
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  const { id } = await context.params;
  const taskId = Array.isArray(id) ? id[0] : id;
  const { title, description, status, priority, due_date } =
    await request.json();
  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  const result = await executeQuery(
    `UPDATE tasks
       SET title       = $1,
           description = $2,
           status      = $3,
           priority    = $4,
           due_date    = $5,
           updated_at  = CURRENT_TIMESTAMP
     WHERE id = $6
     RETURNING *`,
    [title, description, status, priority, due_date, taskId]
  );
  if (result.rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ task: result.rows[0] });
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  const { id } = await context.params;
  const taskId = Array.isArray(id) ? id[0] : id;
  const result = await executeQuery(
    "DELETE FROM tasks WHERE id = $1 RETURNING *",
    [taskId]
  );
  if (result.rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
