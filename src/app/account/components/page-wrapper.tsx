'use client';

interface PageWrapperProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function PageWrapper({ title, subtitle, children }: PageWrapperProps) {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}
