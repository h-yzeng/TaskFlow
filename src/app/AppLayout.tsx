'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut, signIn } from 'next-auth/react';
import { usePathname } from 'next/navigation'; // Add this import

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';
  const [origin, setOrigin] = useState('');
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    setOrigin(window.location.origin);
  }, []);

  const handleSignIn = () => {
    console.log('Sign in button clicked');
    signIn('github', { callbackUrl: origin || '/' });
  };

  // Avoid hydration errors by rendering a simplified version on first render
  if (!isMounted) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
        <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg sticky top-0 z-10">
          {/* Minimal header */}
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
            </div>
          </div>
        </header>
        
        <div className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        </div>
        
        <footer className="mt-auto py-5 border-t border-gray-200 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} Task Manager - Organize your work efficiently
              </p>
            </div>
          </div>
        </footer>
      </main>
    );
  }

  // Full render after component has mounted on client
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
              {isAuthenticated && (
                <Link href="/tasks/new" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-white/10 transition-colors">
                  New Task
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>
      
      {/* Auth status */}
      <div className="bg-blue-700 text-white">
        <div className="container mx-auto px-4 py-1">
          {isLoading ? (
            <div className="h-9 w-24 bg-white/10 rounded-md animate-pulse"></div>
          ) : isAuthenticated ? (
            <div className="flex items-center space-x-3 justify-end">
              <div className="flex items-center">
                {session?.user?.image && (
                  <div className="relative h-8 w-8 mr-2">
                    <Image 
                      src={session.user.image}
                      alt={session.user.name || 'User profile'}
                      fill
                      className="rounded-full border-2 border-white/30 object-cover"
                      sizes="32px"
                    />
                  </div>
                )}
                <span className="text-sm font-medium">{session?.user?.name}</span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: origin || '/' })}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-md text-sm transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex justify-end">
              <button
                onClick={handleSignIn}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-md text-sm transition-colors"
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        ) : !isAuthenticated && !pathname?.includes('/auth/') ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center max-w-md mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-blue-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h2 className="text-xl font-bold mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-6">Please sign in to access your tasks</p>
            <button
              onClick={handleSignIn}
              className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
          </div>
        ) : (
          children
        )}
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