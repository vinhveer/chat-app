'use client';

interface LoadingPageProps {
  title?: string;
  subtitle?: string;
}

export function LoadingPage({ title = "Loading", subtitle = "Please wait..." }: LoadingPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {/* Skeleton Animation */}
        <div className="space-y-4 mb-6">
          <div className="w-32 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto"></div>
          <div className="w-48 h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse mx-auto"></div>
        </div>
        
        {/* Pulse Dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
        
        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
