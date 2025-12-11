import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { tasks, categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import TaskDetailClient from "./task-detail-client";
import type { Metadata } from "next";

interface TaskDetailProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: TaskDetailProps): Promise<Metadata> {
  const { id } = await params;
  const task = await db.query.tasks.findFirst({
    where: eq(tasks.id, id),
  });

  if (!task) {
    return { title: "Task Not Found" };
  }

  return {
    title: task.title,
    description: task.description || `View details for task: ${task.title}`,
  };
}

export default async function TaskDetailPage(props: TaskDetailProps) {
  const { id } = await props.params;

  const task = await db.query.tasks.findFirst({
    where: eq(tasks.id, id),
    with: {
      category: true,
    },
  });

  if (!task) {
    notFound();
  }

  // Transform to match Task type
  const taskData = {
    id: task.id,
    title: task.title,
    description: task.description,
    priority: task.priority,
    completed: task.completed,
    dueDate: task.dueDate?.toISOString() || null,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
    completedAt: task.completedAt?.toISOString() || null,
    category: task.category
      ? { id: task.category.id, name: task.category.name, color: task.category.color }
      : undefined,
  };

  return <TaskDetailClient task={taskData} />;
}