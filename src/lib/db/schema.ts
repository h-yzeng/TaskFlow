export type User = {
  id: number;
  name: string | null;
  email: string | null;
  image: string | null;
  github_id: string | null;
  created_at: Date;
  updated_at: Date;
};

export type Task = {
  id: number;
  title: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date: Date | null;
  created_at: Date;
  updated_at: Date;
  user_id: number | null; 
};