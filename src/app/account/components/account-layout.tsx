'use client';

import { useRouter } from 'next/navigation';

interface AccountLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function AccountLayout({ title, subtitle, children }: AccountLayoutProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button
            onClick={() => router.back()}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

      </header>

      <div className="max-w-4xl mx-auto px-6 py-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6">
        {children}
      </main>
    </div>
  );
}
