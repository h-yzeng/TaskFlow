export type Task = {
    id: number;
    title: string;
    description: string | null;
    status: 'pending' | 'in_progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    due_date: Date | null;
    created_at: Date;
    updated_at: Date;
  };