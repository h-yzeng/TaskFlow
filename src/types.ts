export interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'pending' | 'in progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    due_date?: string | null; 
    created_at?: string;
    updated_at?: string;
    user_id?: string;
  }