import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";

// Batch update multiple tasks (e.g., for reordering or bulk status changes)
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const body = await request.json();

    if (!body.tasks || !Array.isArray(body.tasks)) {
      return NextResponse.json(
        { error: "Tasks array is required" },
        { status: 400 }
      );
    }

    const updatedTasks = [];

    for (const taskUpdate of body.tasks) {
      if (!taskUpdate.id) continue;

      const updateData: Record<string, unknown> = { updatedAt: new Date() };

      if (taskUpdate.completed !== undefined) {
        updateData.completed = taskUpdate.completed;
        updateData.completedAt = taskUpdate.completed ? new Date() : null;
      }
      if (taskUpdate.title !== undefined) updateData.title = taskUpdate.title;
      if (taskUpdate.position !== undefined)
        updateData.position = taskUpdate.position;
      if (taskUpdate.priority !== undefined)
        updateData.priority = taskUpdate.priority;

      const [updated] = await db
        .update(schema.tasks)
        .set(updateData)
        .where(
          and(
            eq(schema.tasks.id, taskUpdate.id),
            eq(schema.tasks.userId, userId)
          )
        )
        .returning();

      if (updated) {
        updatedTasks.push({
          ...updated,
          dueDate: updated.dueDate?.toISOString() || null,
          completedAt: updated.completedAt?.toISOString() || null,
          createdAt:
            updated.createdAt?.toISOString() || new Date().toISOString(),
          updatedAt:
            updated.updatedAt?.toISOString() || new Date().toISOString(),
        });
      }
    }

    return NextResponse.json({ tasks: updatedTasks });
  } catch (error) {
    console.error("Error batch updating tasks:", error);
    return NextResponse.json(
      { error: "Failed to update tasks" },
      { status: 500 }
    );
  }
}

// Legacy POST for single task update (backwards compatibility)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const body = await request.json();
    const taskId = body.id;

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = { updatedAt: new Date() };

    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined)
      updateData.description = body.description;
    if (body.completed !== undefined) {
      updateData.completed = body.completed;
      updateData.completedAt = body.completed ? new Date() : null;
    }
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.dueDate !== undefined) {
      updateData.dueDate = body.dueDate ? new Date(body.dueDate) : null;
    }
    if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;

    if (Object.keys(updateData).length === 1) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const [updatedTask] = await db
      .update(schema.tasks)
      .set(updateData)
      .where(and(eq(schema.tasks.id, taskId), eq(schema.tasks.userId, userId)))
      .returning();

    if (!updatedTask) {
      return NextResponse.json(
        { error: "Task not found or not authorized" },
        { status: 404 }
      );
    }

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

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id);
    const body = await request.json();
    const taskId = body.id;

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    const deletedTasks = await db
      .delete(schema.tasks)
      .where(and(eq(schema.tasks.id, taskId), eq(schema.tasks.userId, userId)))
      .returning({ id: schema.tasks.id });

    if (deletedTasks.length === 0) {
      return NextResponse.json(
        { error: "Task not found or not authorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, id: taskId });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
