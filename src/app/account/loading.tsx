import { LoadingPage } from '@/app/components/ui/loading-page';

export default function AccountLoading() {
  return (
    <LoadingPage 
      title="Loading Account" 
      subtitle="Preparing your account settings..." 
    />
  );
}
