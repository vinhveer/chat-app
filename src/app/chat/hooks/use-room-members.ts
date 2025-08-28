'use client';

import { useState, useEffect, useCallback } from 'react';
import { MemberRoomController } from '@/data/controllers/member_room';
import { Member } from '@/data/controllers/member';
import { OperationStatus } from '@/data/controllers/base/status';
import { getUsersByIds } from '@/data/controllers/base/user';

export function useRoomMembers(roomId: string) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadMembers = useCallback(async () => {
    if (!roomId) {
      setError('Room ID is required');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Get room members using proper controller
      const roomMembersResponse = await MemberRoomController.getRoomMembers({ roomId });
      
      if (roomMembersResponse.status !== OperationStatus.SUCCESS) {
        setError(roomMembersResponse.message || 'Failed to load room members');
        setMembers([]);
        return;
      }

      const roomMembers = roomMembersResponse.data || [];
      if (roomMembers.length === 0) {
        setMembers([]);
        return;
      }

      // Get user details using base controller
      const userIds = roomMembers.map(rm => rm.user_id).filter(Boolean);
      if (userIds.length === 0) {
        setMembers([]);
        return;
      }

      const users = await getUsersByIds(userIds);
      
      if (users && typeof users === 'object') {
        const membersList: Member[] = Object.entries(users)
          .filter(([userId, userData]) => userId && userData)
          .map(([userId, userData]) => ({
            id: userId,
            email: userData.email || '',
            displayName: userData.displayName || 'Unknown User',
            created_at: new Date().toISOString()
          }));
        setMembers(membersList);
      } else {
        setError('Failed to load member details');
        setMembers([]);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(`Error loading members: ${errorMessage}`);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    loadMembers();
  }, [roomId, loadMembers]);

  return {
    members,
    loading,
    error,
    refreshMembers: loadMembers
  };
}
