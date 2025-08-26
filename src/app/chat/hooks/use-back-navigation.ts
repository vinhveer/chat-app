'use client';

import { useRouter } from 'next/navigation';
import { useSidebarToggle } from '@/hooks/use-sidebar-toggle';

export function useBackNavigation() {
  const router = useRouter();
  const { toggle: toggleSidebar } = useSidebarToggle();

  const handleBackClick = () => {
    toggleSidebar();
  };

  return { handleBackClick };
}
