'use client';

import { useAuth } from '@/data/auth';
import { getUserDisplayName, getUserInitials } from '@/utils/user-display';

export function UserAccount() {
  const { user } = useAuth();

  if (!user) return null;

  const userInfo = {
    displayName: getUserDisplayName(user),
    email: user.email || '',
    initials: getUserInitials(user)
  };

  return (
    <div className="p-3">
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full font-medium">
          {userInfo.initials}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {userInfo.displayName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {userInfo.email}
          </p>
        </div>
      </div>
    </div>
  );
}
