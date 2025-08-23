import { useAuth } from '@/data/auth';

export function useUserInfo() {
  const { user } = useAuth();

  const userInfo = {
    displayName: user?.user_metadata?.displayName || user?.email?.split('@')[0] || 'User',
    email: user?.email || ''
  };

  return userInfo;
}
