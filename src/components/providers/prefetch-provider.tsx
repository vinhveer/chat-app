'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/data/auth';
import { 
  LEVEL_1_ROUTES, 
  LEVEL_2_ROUTES,
  AUTHENTICATED_PREFETCH_ROUTES, 
  UNAUTHENTICATED_PREFETCH_ROUTES 
} from '@/lib/prefetch-config';

interface PrefetchProviderProps {
  children: React.ReactNode;
}

export function PrefetchProvider({ children }: PrefetchProviderProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [level2Prefetched, setLevel2Prefetched] = useState<Set<string>>(new Set());

  // Level 1: Always prefetch on app load
  useEffect(() => {
    if (!loading) {
      if (user) {
        LEVEL_1_ROUTES.forEach(route => {
          router.prefetch(route);
        });
      } else {
        UNAUTHENTICATED_PREFETCH_ROUTES.forEach(route => {
          router.prefetch(route);
        });
      }
    }
  }, [user, loading, router]);

  // Function to prefetch Level 2 routes when user hovers/interacts with Level 1
  const prefetchLevel2 = (level1Route: string) => {
    if (level2Prefetched.has(level1Route)) return;

    const level2Routes = LEVEL_2_ROUTES[level1Route as keyof typeof LEVEL_2_ROUTES];
    if (level2Routes && level2Routes.length > 0) {
      level2Routes.forEach(route => {
        router.prefetch(route);
      });
      setLevel2Prefetched(prev => new Set([...prev, level1Route]));
    }
  };

  // Make prefetchLevel2 available globally
  useEffect(() => {
    (window as any).prefetchLevel2 = prefetchLevel2;
    return () => {
      delete (window as any).prefetchLevel2;
    };
  }, []);

  return <>{children}</>;
}
