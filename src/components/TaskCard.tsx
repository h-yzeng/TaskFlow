import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string, completed: boolean) => Promise<void> | void;
  onDelete: (taskId: string) => Promise<void> | void; // New prop for deletion
}

export default function TaskCard({ task, onToggleComplete, onDelete }: TaskCardProps) {
  // Log the task data when component mounts or updates
  console.log(`Rendering TaskCard for task ${task.id}, status: ${task.status}`);
  
  const [isCompleted, setIsCompleted] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Update local state based on task prop - runs on initial render and when task changes
  useEffect(() => {
    console.log(`Task ${task.id} status updated to: ${task.status}`);
    // Normalize status check to handle both formats (with/without underscore)
    const completed = task.status === 'completed';
    console.log(`Setting isCompleted to: ${completed}`);
    setIsCompleted(completed);
  }, [task.status, task.id]);
  
  const handleToggleComplete = async (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    if (isUpdating) {
      console.log('Update already in progress, ignoring click');
      return;
    }
    
    const newCompleted = !isCompleted;
    console.log(`Toggling task ${task.id} completion to: ${newCompleted}`);
    
    setIsUpdating(true);
    
    try {
      // Don't update UI state yet - wait for API call to complete
      await onToggleComplete(task.id, newCompleted);
      // The state will be updated when task prop changes via useEffect
    } catch (error) {
      console.error('Failed to update task status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // New handler for delete functionality
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isDeleting) {
      return; // Prevent multiple clicks
    }
    
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      setIsDeleting(true);
      try {
        await onDelete(task.id);
        // No need to update state here as the component will be removed from DOM
      } catch (error) {
        console.error('Failed to delete task:', error);
        setIsDeleting(false);
      }
    }
  };
  
  const priorityBadge: Record<string, string> = {
    high: 'bg-red-100 text-red-700 border border-red-200',
    medium: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    low: 'bg-green-100 text-green-700 border border-green-200',
  };
  
  // Handle both status formats (with underscore or with space)
  const displayStatus = task.status.replace(/_/g, ' ');
  
  const statusBadge: Record<string, string> = {
    'in progress': 'bg-blue-100 text-blue-700 border border-blue-200',
    'completed': 'bg-green-100 text-green-700 border border-green-200',
    'pending': 'bg-gray-100 text-gray-700 border border-gray-200',
  };

  const formattedDueDate = task.due_date ? new Date(task.due_date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }) : null;
  
  return (
    <div className={`group block bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 hover:translate-y-[-2px] transition-all duration-200 ${isDeleting ? 'opacity-50' : ''}`}>
      <div className="p-5">
        <div className="flex items-start gap-3">
          {/* Checkbox for completion */}
          <button 
            onClick={handleToggleComplete}
            disabled={isUpdating || isDeleting}
            className={`flex-shrink-0 w-5 h-5 mt-1 rounded border flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 ${
              isCompleted 
                ? 'bg-blue-600 border-blue-600 text-white' 
                : 'border-gray-300 hover:border-blue-400'
            } ${(isUpdating || isDeleting) ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
          >
            {isCompleted && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <h3 className={`font-semibold text-gray-800 truncate pr-2 group-hover:text-blue-600 transition-colors ${isCompleted ? 'line-through text-gray-500 group-hover:text-gray-500' : ''}`}>
                {task.title}
              </h3>
              <div className="flex items-center space-x-2">
                {/* Delete button - NEW */}
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-shrink-0 text-gray-400 hover:text-red-500 focus:outline-none focus:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                  aria-label="Delete task"
                  title="Delete task"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                
                <span className={`flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${priorityBadge[task.priority || 'medium']}`}>
                  {task.priority === 'high' && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="inline h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  )}
                  {task.priority}
                </span>
              </div>
            </div>
            
            <p className={`text-sm line-clamp-2 min-h-[40px] ${isCompleted ? 'line-through text-gray-400' : 'text-gray-600'}`}>
              {task.description || 'No description provided.'}
            </p>
            
            {/* Add due date display */}
            {formattedDueDate && (
              <div className="mt-2 mb-3">
                <span className={`inline-flex items-center text-xs font-medium ${
                  isCompleted ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Due: {formattedDueDate}
                </span>
              </div>
            )}
            
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <span className={`flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${statusBadge[displayStatus] || statusBadge['pending']}`}>
                {displayStatus === 'completed' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="inline h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {displayStatus === 'in progress' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="inline h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                )}
                {displayStatus === 'pending' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="inline h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {displayStatus}
              </span>
              
              <Link 
                href={`/tasks/${task.id}`} 
                className="inline-flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-800 transition-colors"
              >
                View Details
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}