import { LoadingPage } from '@/app/components/ui/loading-page';

export default function ResetPasswordLoading() {
  return (
    <LoadingPage 
      title="Loading Security Settings" 
      subtitle="Preparing password reset form..." 
    />
  );
}
