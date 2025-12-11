import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { auth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

function extractId(req: NextRequest): number {
  const parts = req.nextUrl.pathname.split("/");
  return parseInt(parts[parts.length - 1]!);
}

export async function GET(req: NextRequest) {
  try {
    const id = extractId(req);
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    const tasks = await db
      .select()
      .from(schema.tasks)
      .where(and(eq(schema.tasks.id, id), eq(schema.tasks.userId, userId)))
      .limit(1);

    if (tasks.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const task = tasks[0];
    return NextResponse.json({
      task: {
        ...task,
        dueDate: task.dueDate?.toISOString() || null,
        completedAt: task.completedAt?.toISOString() || null,
        createdAt: task.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: task.updatedAt?.toISOString() || new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json(
      { error: "Failed to fetch task" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const id = extractId(req);
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const body = await req.json();

    // Check if task exists
    const existingTasks = await db
      .select()
      .from(schema.tasks)
      .where(and(eq(schema.tasks.id, id), eq(schema.tasks.userId, userId)))
      .limit(1);

    if (existingTasks.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const isCompleted = body.completed ?? false;

    // Update task
    const [updatedTask] = await db
      .update(schema.tasks)
      .set({
        title: body.title,
        description: body.description || null,
        completed: isCompleted,
        priority: body.priority || "medium",
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        categoryId: body.categoryId || null,
        completedAt: isCompleted ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(and(eq(schema.tasks.id, id), eq(schema.tasks.userId, userId)))
      .returning();

    return NextResponse.json({
      task: {
        ...updatedTask,
        dueDate: updatedTask.dueDate?.toISOString() || null,
        completedAt: updatedTask.completedAt?.toISOString() || null,
        createdAt:
          updatedTask.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt:
          updatedTask.updatedAt?.toISOString() || new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const id = extractId(req);
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const body = await req.json();

    // Check if task exists
    const existingTasks = await db
      .select()
      .from(schema.tasks)
      .where(and(eq(schema.tasks.id, id), eq(schema.tasks.userId, userId)))
      .limit(1);

    if (existingTasks.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Partial update
    const updateData: Record<string, unknown> = { updatedAt: new Date() };

    if (body.completed !== undefined) {
      updateData.completed = body.completed;
      if (body.completed) {
        updateData.completedAt = new Date();
      } else {
        updateData.completedAt = null;
      }
    }
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined)
      updateData.description = body.description;
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.dueDate !== undefined) {
      updateData.dueDate = body.dueDate ? new Date(body.dueDate) : null;
    }
    if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;

    const [updatedTask] = await db
      .update(schema.tasks)
      .set(updateData)
      .where(and(eq(schema.tasks.id, id), eq(schema.tasks.userId, userId)))
      .returning();

    return NextResponse.json({
      task: {
        ...updatedTask,
        dueDate: updatedTask.dueDate?.toISOString() || null,
        completedAt: updatedTask.completedAt?.toISOString() || null,
        createdAt:
          updatedTask.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt:
          updatedTask.updatedAt?.toISOString() || new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = extractId(req);
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);

    const deletedTasks = await db
      .delete(schema.tasks)
      .where(and(eq(schema.tasks.id, id), eq(schema.tasks.userId, userId)))
      .returning({ id: schema.tasks.id });

    if (deletedTasks.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
