import { useState, useEffect } from 'react';
import { RoomController, ChatRoom } from '@/data/controllers/room';
import { OperationStatus } from '@/data/controllers/base/status';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/data/controllers/base';

export function useRooms() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRooms = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get room IDs for current user
      const roomIdsResponse = await RoomController.getRoomIdsByMemberId({});
      
      if (roomIdsResponse.status !== OperationStatus.SUCCESS || !roomIdsResponse.data || roomIdsResponse.data.length === 0) {
        setRooms([]);
        setLoading(false);
        return;
      }
      
      // Get room info for those IDs
      const roomInfoResponse = await RoomController.getRoomInfo({ roomIds: roomIdsResponse.data });
      
      if (roomInfoResponse.status === OperationStatus.SUCCESS && roomInfoResponse.data) {
        const rooms = Array.isArray(roomInfoResponse.data) ? roomInfoResponse.data : [roomInfoResponse.data];
        setRooms(rooms);
      } else {
        setError(roomInfoResponse.message || 'Failed to load rooms');
        setRooms([]);
      }
    } catch {
      setError('An error occurred while loading rooms');
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();

    // Get current user ID for filtering
    const setupRealtime = async () => {
      const userResponse = await getCurrentUser(supabase);
      if (userResponse.status !== 'success' || !userResponse.data) {
        return;
      }

      const currentUserId = userResponse.data.id;

      // Subscribe to room changes
      const roomsChannel = supabase
        .channel('rooms-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'chat_rooms'
          },
          () => {
            loadRooms();
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'chat_room_members',
            filter: `user_id=eq.${currentUserId}`
          },
          () => {
            loadRooms();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(roomsChannel);
      };
    };

    const cleanup = setupRealtime();
    return () => {
      cleanup.then(cleanupFn => cleanupFn?.());
    };
  }, []);

  // Expose refresh function globally
  useEffect(() => {
    (window as any).refreshRooms = loadRooms;
    return () => {
      delete (window as any).refreshRooms;
    };
  }, [loadRooms]);

  return {
    rooms,
    loading,
    error,
    refreshRooms: loadRooms
  };
}
