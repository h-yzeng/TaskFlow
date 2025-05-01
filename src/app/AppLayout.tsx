import React from 'react';
import Link from 'next/link';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white/10 rounded-lg p-2 mr-3 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Task Manager</h1>
                <p className="text-xs text-blue-100 font-medium">Organize your work efficiently</p>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-1">
              <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-white/10 transition-colors">
                Dashboard
              </Link>
              <Link href="/tasks/new" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-white/10 transition-colors">
                New Task
              </Link>
            </nav>
          </div>
        </div>
      </header>
      
      <div className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </div>
      
      <footer className="mt-auto py-5 border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Task Manager - Organize your work efficiently
            </p>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <Link href="/help" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                Help
              </Link>
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}