// Task types
export type TaskPriority = "low" | "medium" | "high";

export interface Category {
  id: string;
  name: string;
  color?: string | null;
}

export interface Label {
  id: string;
  name: string;
  color?: string | null;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  priority: TaskPriority;
  completed: boolean;
  dueDate?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
  category?: Category | null;
  categoryId?: string | null;
  labels?: Label[];
  userId?: string | null;
  position?: number;
  parentId?: string | null;
  isRecurring?: boolean;
  recurringPattern?: string | null;
}

export interface TaskFormData {
  title: string;
  description?: string | null;
  priority: TaskPriority;
  dueDate?: string | null;
  categoryId?: string | null;
  completed?: boolean;
}

export interface TaskFilters {
  status: "all" | "active" | "completed";
  priority: "all" | TaskPriority;
  category?: string;
  search?: string;
  sortBy: "dueDate" | "priority" | "createdAt" | "title";
  sortOrder: "asc" | "desc";
}

export interface TaskStats {
  total: number;
  completed: number;
  active: number;
  overdue: number;
  dueToday: number;
  highPriority: number;
}
