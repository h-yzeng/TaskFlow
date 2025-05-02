'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut, signIn } from 'next-auth/react';
import { usePathname } from 'next/navigation';

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

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-blue-600 text-white shadow-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center group">
              <div className="bg-white/10 rounded-lg p-2 mr-3 shadow-inner group-hover:bg-white/15 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Task Manager</h1>
                <p className="text-xs text-blue-100 font-medium">Organize your work efficiently</p>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-4">
              <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-white/10 transition-colors">
                Dashboard
              </Link>
              
              {/* Only show sign-out in the navigation, not "New Task" */}
              {isAuthenticated && (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => signOut({ callbackUrl: origin || '/' })}
                    className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-white/10 transition-colors"
                  >
                    Sign Out
                  </button>
                  
                  {/* User profile display */}
                  <div className="flex items-center pl-3 border-l border-white/20">
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
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>
      
      <div className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        ) : !isAuthenticated && isMounted && !pathname?.includes('/auth/') ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center max-w-md mx-auto mt-16 transition-all hover:shadow-lg">
            <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Authentication Required</h2>
            <p className="text-gray-600 mb-8">Please sign in to access your tasks and start managing your workflow.</p>
            <button
              onClick={handleSignIn}
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V3zm5 10V5a1 1 0 112 0v8a1 1 0 11-2 0zm6-3a1 1 0 10-2 0v3a1 1 0 102 0V10z" clipRule="evenodd" />
              </svg>
              Sign In with GitHub
            </button>
          </div>
        ) : (
          children
        )}
      </div>
      
      <footer className="mt-auto py-6 border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Task Manager - Organize your work efficiently
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
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