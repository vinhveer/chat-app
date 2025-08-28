'use client';

import React from 'react';
import { useRoomMembers } from '../../hooks/use-room-members';

interface MemberListSectionProps {
  roomId: string;
  onRefreshMembers?: (refreshFn: () => void) => void;
}

export function MemberListSection({ roomId, onRefreshMembers }: MemberListSectionProps) {
  const { members, loading, error, refreshMembers } = useRoomMembers(roomId);

  // Provide refresh function to parent
  React.useEffect(() => {
    if (onRefreshMembers && refreshMembers) {
      onRefreshMembers(refreshMembers);
    }
  }, [onRefreshMembers, refreshMembers]);

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-md font-medium text-gray-900 dark:text-white">
          Members
        </h3>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-3 p-2">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium text-gray-900 dark:text-white">
        Members ({members.length})
      </h3>
      
      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {member.displayName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {member.displayName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {member.email}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}