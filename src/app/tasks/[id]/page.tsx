import { notFound } from "next/navigation";
import { executeQuery } from "@/lib/db";
import { Task } from "@/lib/db/schema";
import TaskDetailComponent from "./TaskDetailComponent";

interface TaskDetailProps {
  params: Promise<{ id: string }>;
}

export default async function TaskDetailPage(props: TaskDetailProps) {
  const { params } = props;
  const { id } = await params;

  const result = await executeQuery(
    "SELECT * FROM tasks WHERE id = $1",
    [id]
  );
  
  if (result.rows.length === 0) {
    notFound();
  }
  
  const task: Task = result.rows[0];

  return <TaskDetailComponent task={task} />;
}