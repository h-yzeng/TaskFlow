"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  MoreVertical,
  Trash2,
  Edit,
  Flag,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, formatRelativeDate, isOverdue, isDueToday } from "@/lib/utils";
import type { Task } from "@/types";

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string, completed: boolean) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
  onClick?: (taskId: string) => void;
}

const priorityConfig = {
  high: { color: "border-l-red-500", textColor: "text-red-600", icon: AlertCircle, label: "High" },
  medium: { color: "border-l-yellow-500", textColor: "text-yellow-600", icon: Flag, label: "Medium" },
  low: { color: "border-l-green-500", textColor: "text-green-600", icon: Flag, label: "Low" },
};

export function TaskCard({ task, onToggleComplete, onDelete, onClick }: TaskCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isCompleted = task.completed;
  const priority = priorityConfig[task.priority as keyof typeof priorityConfig] || priorityConfig.medium;
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const taskOverdue = !isCompleted && dueDate && isOverdue(dueDate);
  const taskDueToday = !isCompleted && dueDate && isDueToday(dueDate);

  const handleToggle = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await onToggleComplete(task.id, !isCompleted);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    if (!confirm(`Delete "${task.title}"?`)) return;
    setIsDeleting(true);
    try {
      await onDelete(task.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(task.id);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          "group task-card cursor-pointer border-l-4 hover:border-primary/50",
          isCompleted && "opacity-60",
          isDeleting && "opacity-50 pointer-events-none",
          priority.color
        )}
        onClick={handleCardClick}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Checkbox */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={isCompleted}
                    onCheckedChange={handleToggle}
                    disabled={isUpdating}
                    className={cn(
                      "transition-all",
                      isUpdating && "opacity-50"
                    )}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {isCompleted ? "Mark as incomplete" : "Mark as complete"}
              </TooltipContent>
            </Tooltip>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <Link
                  href={`/tasks/${task.id}`}
                  className="flex-1 min-w-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3
                    className={cn(
                      "font-medium text-foreground truncate hover:text-primary transition-colors",
                      isCompleted && "line-through text-muted-foreground"
                    )}
                  >
                    {task.title}
                  </h3>
                </Link>

                {/* Actions */}
                <div onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/tasks/${task.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleDelete}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Description */}
              {task.description && (
                <p
                  className={cn(
                    "text-sm text-muted-foreground mt-1 line-clamp-2",
                    isCompleted && "line-through"
                  )}
                >
                  {task.description}
                </p>
              )}

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {/* Priority */}
                <Badge variant="outline" className={cn("text-xs gap-1", priority.textColor)}>
                  <priority.icon className="h-3 w-3" />
                  {priority.label}
                </Badge>

                {/* Completed Status */}
                {isCompleted && (
                  <Badge variant="secondary" className="text-xs">
                    Completed
                  </Badge>
                )}

                {/* Due date */}
                {dueDate && (
                  <Badge
                    variant={taskOverdue ? "destructive" : taskDueToday ? "outline" : "outline"}
                    className={cn("text-xs gap-1", taskDueToday && "border-yellow-500 text-yellow-600")}
                  >
                    <Calendar className="h-3 w-3" />
                    {formatRelativeDate(dueDate)}
                  </Badge>
                )}

                {/* Category */}
                {task.category && (
                  <Badge variant="outline" className="text-xs">
                    {task.category.name}
                  </Badge>
                )}
              </div>

              {/* Labels */}
              {task.labels && task.labels.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {task.labels.map((label) => (
                    <Badge
                      key={label.id}
                      variant="outline"
                      className="text-xs"
                    >
                      {label.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
