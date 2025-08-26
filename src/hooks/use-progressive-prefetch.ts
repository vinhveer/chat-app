'use client';

import { useRouter } from 'next/navigation';
import { LEVEL_2_ROUTES } from '@/lib/prefetch-config';

export function useProgressivePrefetch() {
  const router = useRouter();

  const prefetchOnHover = (level1Route: string) => {
    // Trigger Level 2 prefetching when hovering over Level 1 routes
    if (typeof window !== 'undefined' && (window as any).prefetchLevel2) {
      (window as any).prefetchLevel2(level1Route);
    }
  };

  const prefetchRoomRoutes = (roomIds: string[]) => {
    // Dynamically prefetch room routes when room list is loaded
    roomIds.forEach(roomId => {
      router.prefetch(`/${roomId}`);
    });
  };

  const prefetchUserRoutes = (userIds: string[]) => {
    // Dynamically prefetch direct message routes
    userIds.forEach(userId => {
      router.prefetch(`/direct/${userId}`);
    });
  };

  return {
    prefetchOnHover,
    prefetchRoomRoutes,
    prefetchUserRoutes,
  };
}
