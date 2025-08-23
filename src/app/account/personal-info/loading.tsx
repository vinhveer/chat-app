import { LoadingPage } from '@/app/components/ui/loading-page';

export default function PersonalInfoLoading() {
  return (
    <LoadingPage 
      title="Loading Personal Info" 
      subtitle="Fetching your personal information..." 
    />
  );
}
