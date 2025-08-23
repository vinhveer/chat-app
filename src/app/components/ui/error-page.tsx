'use client';

import { useRouter } from 'next/navigation';

interface ErrorPageProps {
  title?: string;
  message?: string;
  showRetry?: boolean;
  showHome?: boolean;
}

export function ErrorPage({ 
  title = "Something went wrong", 
  message = "An unexpected error occurred. Please try again.",
  showRetry = true,
  showHome = true 
}: ErrorPageProps) {
  const router = useRouter();

  const handleRetry = () => {
    window.location.reload();
  };

  const handleHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        {/* Error Icon */}
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {message}
        </p>

        <div className="space-y-3">
          {showRetry && (
            <button
              onClick={handleRetry}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Try Again
            </button>
          )}
          
          {showHome && (
            <button
              onClick={handleHome}
              className="w-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white py-2 px-4 rounded-lg transition-colors"
            >
              Go Home
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
