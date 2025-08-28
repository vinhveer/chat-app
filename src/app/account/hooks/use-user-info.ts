import { useAuth } from '@/data/auth';
import { getUserDisplayName } from '@/utils/user-display';

export function useUserInfo() {
  const { user } = useAuth();

  const userInfo = {
    displayName: getUserDisplayName(user),
    email: user?.email || ''
  };

  return userInfo;
}
