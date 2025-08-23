'use client';

interface FullPageLoadingProps {
  message?: string;
}

export function FullPageLoading({ message = "Loading..." }: FullPageLoadingProps) {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center transition-opacity duration-200">
      <div className="text-center">
        {/* Circle Loading */}
        <div className="relative">
          <div className="w-10 h-10 border-3 border-gray-200 dark:border-gray-700 rounded-full animate-spin border-t-blue-600 mx-auto mb-3"></div>
        </div>
        
        {/* Loading Text */}
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
          {message}
        </p>
      </div>
    </div>
  );
}
