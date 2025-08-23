'use client';

import { useRouter } from 'next/navigation';

export function useBackNavigation() {
  const router = useRouter();

  const handleBackClick = () => {
    if ((window as any).toggleSidebar) {
      (window as any).toggleSidebar();
    } else {
      router.back();
    }
  };

  return { handleBackClick };
}
