'use client';

import { useState, useEffect } from 'react';
import { MemberRoomController } from '@/data/controllers/member_room';
import { Member } from '@/data/controllers/member';
import { OperationStatus } from '@/data/controllers/base/status';

export function useRoomMembers(roomId: string) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadMembers = async () => {
    setLoading(true);
    setError('');

    try {
      // Get room members using proper controller
      const roomMembersResponse = await MemberRoomController.getRoomMembers({ roomId });
      
      if (roomMembersResponse.status !== OperationStatus.SUCCESS) {
        setError(roomMembersResponse.message || 'Failed to load room members');
        setLoading(false);
        return;
      }

      const roomMembers = roomMembersResponse.data || [];
      if (roomMembers.length === 0) {
        setMembers([]);
        setLoading(false);
        return;
      }

      // Get user details using existing API
      const userIds = roomMembers.map(rm => rm.user_id);
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userIds }),
      });

      if (response.ok) {
        const { users } = await response.json();
        const membersList: Member[] = Object.entries(users).map(([userId, userData]) => ({
          id: userId,
          email: (userData as any).email,
          displayName: (userData as any).displayName
        }));
        setMembers(membersList);
      } else {
        setError('Failed to load member details');
      }
    } catch (error) {
      setError('Error loading members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, [roomId]);

  return {
    members,
    loading,
    error,
    refreshMembers: loadMembers
  };
}
