'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface RoutePreloaderProps {
  children: React.ReactNode;
}

export function RoutePreloader({ children }: RoutePreloaderProps) {
  const router = useRouter();

  useEffect(() => {
    // Preload important routes
    const importantRoutes = [
      '/chat',
      '/account',
      '/account/personal-info',
      '/account/reset-password',
      '/auth/login',
      '/auth/signup'
    ];

    // Preload routes after a short delay to not block initial render
    const timer = setTimeout(() => {
      importantRoutes.forEach(route => {
        router.prefetch(route);
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return <>{children}</>;
}
