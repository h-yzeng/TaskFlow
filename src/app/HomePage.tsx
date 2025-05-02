'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TaskCard from '@/components/TaskCard';
import { Task } from '../types'; 

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    console.log('Fetching tasks...');
    try {
      setIsLoading(true);
      const response = await fetch('/api/tasks');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      
      if (data.tasks && Array.isArray(data.tasks)) {
        console.log('Received tasks:', data.tasks);
        setTasks(data.tasks);
      } else if (Array.isArray(data)) {
        console.log('Received tasks array:', data);
        setTasks(data);
      } else {
        console.error('Unexpected API response format:', data);
        setError('Unexpected data format from API');
        setTasks([]);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleToggleComplete = async (taskId: string, completed: boolean): Promise<void> => {
    console.log(`Toggling task ${taskId} to ${completed ? 'completed' : 'not completed'}`);
    
    try {
      const taskToUpdate = tasks.find(t => t.id === taskId);
      if (!taskToUpdate) {
        console.error(`Task not found with ID: ${taskId}`);
        throw new Error('Task not found');
      }
      
      console.log(`Found task to update:`, taskToUpdate);
      
      let useUnderscores = false;
      for (const t of tasks) {
        if (typeof t.status === 'string' && t.status.includes('_')) {
          useUnderscores = true;
          break;
        }
      }
      
      let newStatus: string;
      if (completed) {
        newStatus = 'completed';
      } else {
        newStatus = useUnderscores ? 'in_progress' : 'in progress';
      }
      
      console.log(`Setting new status to: ${newStatus}`);
      
      // Try a direct POST to the "update" endpoint instead of using PUT/PATCH
      // This avoids potential routing issues with dynamic segments
      const response = await fetch(`/api/tasks/update`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: taskId,
          status: newStatus 
        }),
      });
      
      console.log(`Response status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        let errorMessage: string;
        try {
          const responseBody = await response.text();
          console.error("Error response body:", responseBody);
          
          try {
            const errorJson = JSON.parse(responseBody);
            console.error("Parsed error JSON:", errorJson);
            errorMessage = errorJson.error || `Server error (${response.status})`;
          } catch {
            console.error("Error response is not valid JSON");
            errorMessage = responseBody || `Server error (${response.status})`;
          }
        } catch (error) {
          console.error("Could not read error response", error);
          errorMessage = `Server error (${response.status})`;
        }
        
        console.error(`Task update failed: ${errorMessage}`);
        throw new Error(errorMessage);
      }

      // Handle successful response
      const responseBody = await response.text();
      console.log(`Success response body:`, responseBody);
      
      if (responseBody && responseBody.trim()) {
        try {
          const responseData = JSON.parse(responseBody);
          console.log('Parsed server response:', responseData);
          
          if (responseData && responseData.task) {
            console.log('Using server task data:', responseData.task);
            setTasks(prevTasks => 
              prevTasks.map(task => 
                task.id === taskId ? responseData.task : task
              )
            );
            console.log('Task updated with server data');
            return;
          } else {
            console.warn('Server response does not contain task data:', responseData);
          }
        } catch {
          console.error('Failed to parse response as JSON');
        }
      } else {
        console.warn('Server returned empty response body');
      }
      
      // Fallback to client-side update
      console.log('Using client-side update as fallback');
      setTasks(prevTasks => {
        return prevTasks.map(task => {
          if (task.id === taskId) {
            console.log(`Updating task ${taskId} client-side`);
            return {
              ...task,
              status: newStatus as Task['status'] 
            };
          }
          return task;
        });
      });
      
      console.log('Task updated successfully (client-side)');
    } catch (error) {
      console.error('Error in handleToggleComplete:', error);
      alert(`Failed to update task: ${error instanceof Error ? error.message : 'Unknown error'}`);
      fetchTasks();
    }
  };

  // New handler for deleting tasks
  const handleDeleteTask = async (taskId: string): Promise<void> => {
    console.log(`Deleting task ${taskId}`);
    
    try {
      const response = await fetch(`/api/tasks/update`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: taskId }),
      });
      
      console.log(`Delete response status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        let errorMessage: string;
        try {
          const responseBody = await response.text();
          console.error("Delete error response body:", responseBody);
          
          try {
            const errorJson = JSON.parse(responseBody);
            console.error("Parsed delete error JSON:", errorJson);
            errorMessage = errorJson.error || `Server error (${response.status})`;
          } catch {
            console.error("Delete error response is not valid JSON");
            errorMessage = responseBody || `Server error (${response.status})`;
          }
        } catch (error) {
          console.error("Could not read delete error response", error);
          errorMessage = `Server error (${response.status})`;
        }
        
        console.error(`Task deletion failed: ${errorMessage}`);
        throw new Error(errorMessage);
      }
      
      // If deletion was successful, update the local state
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      console.log(`Task ${taskId} deleted successfully`);
      
    } catch (error) {
      console.error('Error in handleDeleteTask:', error);
      alert(`Failed to delete task: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // Refresh the tasks list in case of error
      fetchTasks();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p>{error}</p>
        <button 
          onClick={() => fetchTasks()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-6">
        <div className="flex items-center">
          <h2 className="text-3xl font-bold text-gray-800 relative">
            All Tasks
            <span className="absolute -bottom-1.5 left-0 w-20 h-1 bg-blue-500 rounded-full"></span>
          </h2>
          <div className="ml-6 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-100 shadow-sm">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
          </div>
        </div>
        <Link 
          href="/tasks/new" 
          className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm group"
        >
          <span className="bg-white/20 rounded-md p-1 mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </span>
          <span>Add New Task</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="bg-blue-50 rounded-full p-5 mb-6 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-3">No tasks found</h3>
          <p className="text-gray-600 mb-8 text-center max-w-md">Your task list is empty. Start organizing your work by creating your first task.</p>
          <Link 
            href="/tasks/new" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create First Task
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
}