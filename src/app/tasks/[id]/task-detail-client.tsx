"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  Trash2,
  CheckCircle2,
  Circle,
  Flag,
  Tag,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate, formatRelativeDate, isOverdue, isDueToday } from "@/lib/utils";
import type { Task } from "@/types";

interface TaskDetailClientProps {
  task: Task;
}

export default function TaskDetailClient({ task }: TaskDetailClientProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [currentTask, setCurrentTask] = useState(task);

  const priorityConfig = {
    high: { color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30", label: "High" },
    medium: { color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-100 dark:bg-yellow-900/30", label: "Medium" },
    low: { color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/30", label: "Low" },
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleToggleComplete = async () => {
    setIsToggling(true);
    try {
      const newCompleted = !currentTask.completed;
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          completed: newCompleted,
          completedAt: newCompleted ? new Date().toISOString() : null,
        }),
      });

      if (res.ok) {
        setCurrentTask((prev) => ({
          ...prev,
          completed: newCompleted,
          completedAt: newCompleted ? new Date().toISOString() : null,
        }));
      }
    } catch (error) {
      console.error("Failed to toggle task:", error);
    } finally {
      setIsToggling(false);
    }
  };

  const priority = priorityConfig[currentTask.priority as keyof typeof priorityConfig] || priorityConfig.medium;
  const dueDate = currentTask.dueDate ? new Date(currentTask.dueDate) : null;
  const overdue = dueDate ? isOverdue(dueDate) && !currentTask.completed : false;
  const dueToday = dueDate ? isDueToday(dueDate) : false;

  return (
    <div className="container max-w-5xl mx-auto px-4 md:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Back Button */}
        <Button variant="ghost" asChild className="group">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </Link>
        </Button>

        {/* Main Card */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleToggleComplete}
                    disabled={isToggling}
                    className="flex-shrink-0 transition-colors hover:text-primary"
                  >
                    {currentTask.completed ? (
                      <CheckCircle2 className="h-7 w-7 text-green-600" />
                    ) : (
                      <Circle className="h-7 w-7 text-muted-foreground" />
                    )}
                  </button>
                  <h1
                    className={`text-2xl font-bold ${
                      currentTask.completed ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {currentTask.title}
                  </h1>
                </div>
                <div className="flex flex-wrap gap-2 pl-10">
                  <Badge variant={currentTask.completed ? "secondary" : "default"}>
                    {currentTask.completed ? "Completed" : "Active"}
                  </Badge>
                  <Badge className={`${priority.bg} ${priority.color} border-0`}>
                    <Flag className="mr-1 h-3 w-3" />
                    {priority.label} Priority
                  </Badge>
                  {currentTask.category && (
                    <Badge variant="outline">
                      <Tag className="mr-1 h-3 w-3" />
                      {currentTask.category.name}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href={`/tasks/${task.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6 space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Description
              </h3>
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {currentTask.description || "No description provided."}
                </p>
              </div>
            </div>

            {/* Dates Grid */}
            <div className="grid gap-4 sm:grid-cols-3">
              {/* Due Date */}
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className={`h-4 w-4 ${overdue ? "text-destructive" : dueToday ? "text-yellow-600" : "text-muted-foreground"}`} />
                  <span className="text-sm font-medium">Due Date</span>
                </div>
                <div className="space-y-1">
                  {dueDate ? (
                    <>
                      <p className={`font-medium ${overdue ? "text-destructive" : ""}`}>
                        {formatDate(dueDate)}
                      </p>
                      <p className={`text-xs ${overdue ? "text-destructive" : "text-muted-foreground"}`}>
                        {overdue && <AlertTriangle className="inline mr-1 h-3 w-3" />}
                        {formatRelativeDate(dueDate)}
                      </p>
                    </>
                  ) : (
                    <p className="text-muted-foreground">Not set</p>
                  )}
                </div>
              </div>

              {/* Created At */}
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Created</span>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">
                    {currentTask.createdAt
                      ? formatDate(new Date(currentTask.createdAt))
                      : "Unknown"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {currentTask.createdAt
                      ? formatRelativeDate(new Date(currentTask.createdAt))
                      : ""}
                  </p>
                </div>
              </div>

              {/* Completed At */}
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className={`h-4 w-4 ${currentTask.completed ? "text-green-600" : "text-muted-foreground"}`} />
                  <span className="text-sm font-medium">Completed</span>
                </div>
                <div className="space-y-1">
                  {currentTask.completed && currentTask.completedAt ? (
                    <>
                      <p className="font-medium text-green-600">
                        {formatDate(new Date(currentTask.completedAt))}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeDate(new Date(currentTask.completedAt))}
                      </p>
                    </>
                  ) : (
                    <p className="text-muted-foreground">Not completed</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Task</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete &quot;{task.title}&quot;? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}
