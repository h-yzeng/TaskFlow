import Link from 'next/link';
import { executeQuery } from '@/lib/db';
import { Task } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const result = await executeQuery('SELECT * FROM tasks ORDER BY created_at DESC');
  const tasks: Task[] = result.rows;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">All Tasks</h2>
        <Link 
          href="/tasks/new" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New Task
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No tasks found. Create your first task now!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <div 
              key={task.id} 
              className="bg-white p-4 rounded shadow border hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium truncate">{task.title}</h3>
                <span className={`text-xs px-2 py-1 rounded ${
                  task.priority === 'high' 
                    ? 'bg-red-100 text-red-800' 
                    : task.priority === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {task.priority}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {task.description || 'No description'}
              </p>
              
              <div className="flex justify-between items-center">
                <span className={`text-xs px-2 py-1 rounded ${
                  task.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : task.status === 'in_progress'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {task.status.replace('_', ' ')}
                </span>
                
                <Link
                  href={`/tasks/${task.id}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}