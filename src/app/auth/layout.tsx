import { PublicRoute } from '@/data/auth';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6 lg:p-12" style={{ minHeight: '100dvh' }}>
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </PublicRoute>
  );
}
