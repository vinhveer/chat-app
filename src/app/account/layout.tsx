'use client';

import { useRouter } from 'next/navigation';
import { LoadingProvider, RoutePreloader } from "../components";

interface AccountLayoutProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <RoutePreloader>
      <LoadingProvider>
        <div className="min-h-screen-stable">
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

          {/* Content */}
          <main className="max-w-4xl mx-auto px-6">
            {children}
          </main>
        </div>
      </LoadingProvider>
    </RoutePreloader>
  );
}
