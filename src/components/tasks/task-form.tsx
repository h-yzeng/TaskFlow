"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TaskFormData, Category } from "@/types";

interface TaskFormProps {
  categories?: Category[];
  defaultValues?: Partial<TaskFormData>;
  onSubmit?: (data: TaskFormData) => Promise<void>;
  onSuccess?: () => void;
  onCancel?: () => void;
  isEdit?: boolean;
}

export function TaskForm({
  categories = [],
  defaultValues,
  onSubmit,
  onSuccess,
  onCancel,
  isEdit = false,
}: TaskFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<TaskFormData>({
    title: defaultValues?.title || "",
    description: defaultValues?.description || "",
    priority: defaultValues?.priority || "medium",
    dueDate: defaultValues?.dueDate || null,
    categoryId: defaultValues?.categoryId || null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Default behavior: POST to API
        const res = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to create task");
        }
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          placeholder="Enter task title..."
          autoFocus
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Add more details about this task..."
          rows={4}
        />
      </div>

      {/* Priority & Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value) =>
              setFormData({ ...formData, priority: value as TaskFormData["priority"] })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {categories.length > 0 && (
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={formData.categoryId || "none"}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  categoryId: value === "none" ? null : value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No category</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Due Date & Time */}
      <div className="space-y-2">
        <Label>Due Date & Time</Label>
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="date"
            value={
              formData.dueDate
                ? new Date(formData.dueDate).toLocaleDateString("en-CA")
                : ""
            }
            onChange={(e) => {
              if (e.target.value) {
                const existingTime = formData.dueDate
                  ? new Date(formData.dueDate).toTimeString().slice(0, 5)
                  : "12:00";
                const newDateTime = `${e.target.value}T${existingTime}`;
                setFormData({
                  ...formData,
                  dueDate: new Date(newDateTime).toISOString(),
                });
              } else {
                setFormData({ ...formData, dueDate: null });
              }
            }}
            placeholder="Select date"
          />
          <Input
            type="time"
            value={
              formData.dueDate
                ? new Date(formData.dueDate).toTimeString().slice(0, 5)
                : ""
            }
            onChange={(e) => {
              if (e.target.value && formData.dueDate) {
                const existingDate = new Date(formData.dueDate)
                  .toLocaleDateString("en-CA");
                const newDateTime = `${existingDate}T${e.target.value}`;
                setFormData({
                  ...formData,
                  dueDate: new Date(newDateTime).toISOString(),
                });
              }
            }}
            placeholder="Select time"
            disabled={!formData.dueDate}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || !formData.title.trim()}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEdit ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              {isEdit ? "Update Task" : "Create Task"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
