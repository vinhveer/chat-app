'use client';

import { Spinner } from './spinner';

interface SpinnerFullPageProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function SpinnerFullPage({ 
  message = 'Loading...', 
  size = 'lg',
  className = ''
}: SpinnerFullPageProps) {
  return (
    <div className={`min-h-screen grid place-items-center bg-white dark:bg-gray-950 transition-colors duration-200 ${className}`}>
      <div className="flex flex-col items-center space-y-4" role="status" aria-live="polite">
        <div className="relative">
          <Spinner 
            size={size} 
            color="blue"
            className="!border-4 !h-16 !w-16" 
          />
          {/* Add subtle glow effect in dark mode */}
          <div className="absolute inset-0 -z-10 blur-xl opacity-20 dark:opacity-40">
            <Spinner 
              size={size} 
              color="blue"
              className="!border-4 !h-16 !w-16" 
            />
          </div>
        </div>
        {message && (
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300 animate-pulse">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
