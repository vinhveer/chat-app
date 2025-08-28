'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/data/auth';
import { useSidebarToggle } from '@/hooks/use-sidebar-toggle';

interface AccountLayoutProps {
  children: React.ReactNode;
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { toggle: toggleSidebar, close: closeSidebar } = useSidebarToggle();

  const handleBackClick = () => {
    router.back();
    // Close sidebar on mobile when going back
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      closeSidebar();
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen-stable flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gray-200 dark:border-gray-700 rounded-full animate-spin border-t-blue-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleBackClick}
              className="p-2 -ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Go back"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={toggleSidebar}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
