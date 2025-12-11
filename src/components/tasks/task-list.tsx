"use client";

import { AnimatePresence } from "framer-motion";
import { TaskCard } from "./task-card";
import type { Task } from "@/types";

export interface TaskListProps {
  tasks: Task[];
  onTaskToggle: (taskId: string, completed: boolean) => Promise<void>;
  onTaskDelete: (taskId: string) => Promise<void>;
  onTaskClick?: (taskId: string) => void;
}

export function TaskList({
  tasks,
  onTaskToggle,
  onTaskDelete,
  onTaskClick,
}: TaskListProps) {
  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggleComplete={onTaskToggle}
            onDelete={onTaskDelete}
            onClick={onTaskClick}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
