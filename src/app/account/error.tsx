'use client';

import { ErrorPage } from '@/app/components/ui/error-page';

interface AccountErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AccountError({ error: _error, reset: _reset }: AccountErrorProps) {
  return (
    <ErrorPage 
      title="Account Error"
      message="Failed to load account settings. Please try again."
      showRetry={true}
      showHome={true}
    />
  );
}
