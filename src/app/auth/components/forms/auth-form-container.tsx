import Link from 'next/link';

interface AuthFormContainerProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  showBackButton?: boolean;
  backHref?: string;
  backText?: string;
  onBackClick?: () => void;
}

export function AuthFormContainer({ 
  title, 
  subtitle, 
  children, 
  showBackButton = false,
  backHref = '/auth/login',
  backText = 'Back to Sign In',
  onBackClick
}: AuthFormContainerProps) {
  return (
    <div className="py-8">
      {showBackButton && (
        <div className="mb-6">
          {onBackClick ? (
            <button
              onClick={onBackClick}
              className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>{backText}</span>
            </button>
          ) : (
            <Link
              href={backHref}
              className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>{backText}</span>
            </Link>
          )}
        </div>
      )}
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          {subtitle}
        </p>
      </div>
      {children}
    </div>
  );
}
