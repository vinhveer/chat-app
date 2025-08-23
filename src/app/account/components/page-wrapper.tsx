'use client';

interface PageWrapperProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function PageWrapper({ title, subtitle, children }: PageWrapperProps) {
  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        {title}
      </h1>
      {subtitle && (
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {subtitle}
        </p>
      )}
      <div className="mt-6">
        {children}
      </div>
    </div>
  );
}
