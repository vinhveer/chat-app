'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FullPageLoading } from '../full-page-loading';

interface LoadingProviderProps {
  children: React.ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    // Start loading
    setIsLoading(true);
    
    // Show loading for a brief moment, then show new page
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsLoading(false);
    }, 300); // Show loading for 300ms

    return () => clearTimeout(timer);
  }, [pathname, children]);

  if (isLoading) {
    return <FullPageLoading message="Loading page..." />;
  }

  return <>{displayChildren}</>;
}
