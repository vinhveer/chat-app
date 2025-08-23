'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/data/auth';
import { NavigationSidebar, LoadingSpinner } from './components';

interface ChatLayoutProps {
  children: React.ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  // Expose sidebar toggle globally for other components
  useEffect(() => {
    (window as any).toggleSidebar = () => setIsSidebarOpen(true);
    return () => {
      delete (window as any).toggleSidebar;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const currentPath = pathname.replace('/chat', '') || '/';

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <main className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {isNavigating ? (
          <div className="flex-1 flex items-center justify-center">
            <LoadingSpinner message="Loading page..." />
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}
