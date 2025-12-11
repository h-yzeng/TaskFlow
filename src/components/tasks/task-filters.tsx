"use client";

import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TaskFilters, Category } from "@/types";

interface TaskFiltersProps {
  filters: TaskFilters;
  categories?: Category[];
  onFiltersChange: (filters: TaskFilters) => void;
}

export function TaskFiltersBar({
  filters,
  onFiltersChange,
}: TaskFiltersProps) {
  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) => value && value !== "all" && key !== "sortBy" && key !== "sortOrder"
  ).length;

  const resetFilters = () => {
    onFiltersChange({
      status: "all",
      priority: "all",
      sortBy: "dueDate",
      sortOrder: "asc",
      search: undefined,
      category: undefined,
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={filters.search || ""}
          onChange={(e) =>
            onFiltersChange({ ...filters, search: e.target.value })
          }
          className="pl-9"
        />
        {filters.search && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={() => onFiltersChange({ ...filters, search: "" })}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Status Filter */}
      <Select
        value={filters.status}
        onValueChange={(value) =>
          onFiltersChange({
            ...filters,
            status: value as TaskFilters["status"],
          })
        }
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Tasks</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>

      {/* Priority Filter */}
      <Select
        value={filters.priority}
        onValueChange={(value) =>
          onFiltersChange({
            ...filters,
            priority: value as TaskFilters["priority"],
          })
        }
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priority</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectContent>
      </Select>

      {/* Sort */}
      <Select
        value={`${filters.sortBy}-${filters.sortOrder}`}
        onValueChange={(value) => {
          const [sortBy, sortOrder] = value.split("-") as [
            TaskFilters["sortBy"],
            TaskFilters["sortOrder"]
          ];
          onFiltersChange({ ...filters, sortBy, sortOrder });
        }}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="createdAt-desc">Newest First</SelectItem>
          <SelectItem value="createdAt-asc">Oldest First</SelectItem>
          <SelectItem value="dueDate-asc">Due Date (Soonest)</SelectItem>
          <SelectItem value="dueDate-desc">Due Date (Latest)</SelectItem>
          <SelectItem value="priority-desc">Priority (High-Low)</SelectItem>
          <SelectItem value="priority-asc">Priority (Low-High)</SelectItem>
          <SelectItem value="title-asc">Title (A-Z)</SelectItem>
          <SelectItem value="title-desc">Title (Z-A)</SelectItem>
        </SelectContent>
      </Select>

      {/* Reset Filters */}
      {activeFilterCount > 0 && (
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          <X className="mr-1 h-4 w-4" />
          Clear ({activeFilterCount})
        </Button>
      )}
    </div>
  );
}
