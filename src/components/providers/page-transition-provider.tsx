'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface PageTransitionProviderProps {
  children: React.ReactNode;
}

export function PageTransitionProvider({ children }: PageTransitionProviderProps) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const [slideDirection, setSlideDirection] = useState<'forward' | 'backward' | 'none'>('none');

  useEffect(() => {
    // Determine slide direction based on route depth
    const currentDepth = pathname.split('/').length;
    const prevPath = sessionStorage.getItem('prevPath') || '';
    const prevDepth = prevPath.split('/').length;
    
    if (currentDepth > prevDepth) {
      setSlideDirection('forward'); // Going deeper
    } else if (currentDepth < prevDepth) {
      setSlideDirection('backward'); // Going back
    } else {
      setSlideDirection('none'); // Same level
    }

    // Start transition
    setIsTransitioning(true);
    
    // Update children after fast transition
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsTransitioning(false);
    }, 75); // Very fast transition

    // Store current path for next transition
    sessionStorage.setItem('prevPath', pathname);

    return () => clearTimeout(timer);
  }, [pathname, children]);

  const getTransitionClasses = () => {
    const baseClasses = 'transition-all duration-150 ease-out';
    
    if (!isTransitioning) {
      return `${baseClasses} opacity-100 transform scale-100`;
    }

    switch (slideDirection) {
      case 'forward':
        return `${baseClasses} opacity-0 transform scale-95`; // Scale down cover effect
      case 'backward':
        return `${baseClasses} opacity-0 transform scale-105`; // Scale up cover effect
      default:
        return `${baseClasses} opacity-0 transform scale-98`; // Subtle scale
    }
  };

  return (
    <div className="relative overflow-hidden">
      <div className={getTransitionClasses()}>
        {displayChildren}
      </div>
    </div>
  );
}
