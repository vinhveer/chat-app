import { LoadingPage } from '@/app/components/ui/loading-page';

export default function LogoutLoading() {
  return (
    <LoadingPage 
      title="Loading Logout" 
      subtitle="Preparing sign out options..." 
    />
  );
}
