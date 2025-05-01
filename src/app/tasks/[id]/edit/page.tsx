"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditTaskPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");
  const [status, setStatus] = useState<"pending" | "in_progress" | "completed">("pending");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    async function fetchTask() {
      const res = await fetch(`/api/tasks/${id}`);
      if (res.ok) {
        const { task } = await res.json();
        setTitle(task.title);
        setDescription(task.description || "");
        setPriority(task.priority);
        setStatus(task.status);
        setDueDate(task.due_date?.slice(0, 10) || "");
      }
      setLoading(false);
    }
    fetchTask();
  }, [id]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, status, priority, due_date: dueDate }),
    });
    router.push(`/tasks/${id}`);
  }

  if (loading) {
    return <p className="text-center py-10">Loading…</p>;
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Edit Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block font-medium mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Enter task title"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
            rows={4}
            placeholder="Enter a longer description (optional)"
          />
        </div>

        {/* Priority */}
        <div>
          <label htmlFor="priority" className="block font-medium mb-1">
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPriority(e.target.value as "low" | "medium" | "high")}
            className="w-full border p-2 rounded"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block font-medium mb-1">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value as "pending" | "in_progress" | "completed")}
            className="w-full border p-2 rounded"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Due Date */}
        <div>
          <label htmlFor="dueDate" className="block font-medium mb-1">
            Due Date
          </label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDueDate(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
