'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { deleteRecord, getCurrentUser } from '@/data/controllers/base';

interface DeleteRoomSectionProps {
  roomId: string;
  onClose?: () => void;
}

export function DeleteRoomSection({ roomId, onClose }: DeleteRoomSectionProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDeleteRoom = async () => {
    setDeleting(true);
    setError('');

    try {
      // Check if user is room creator
      const userResponse = await getCurrentUser(supabase);
      if (userResponse.status !== 'success' || !userResponse.data) {
        setError('User not authenticated');
        setDeleting(false);
        return;
      }

      // Delete room members first
      const deleteMembersResponse = await deleteRecord(supabase, {
        table: 'chat_room_members',
        filters: { room_id: roomId }
      });

      if (deleteMembersResponse.status !== 'success') {
        setError('Failed to remove room members');
        setDeleting(false);
        return;
      }

      // Delete messages
      const deleteMessagesResponse = await deleteRecord(supabase, {
        table: 'chat_messages',
        filters: { room_id: roomId }
      });

      if (deleteMessagesResponse.status !== 'success') {
        setError('Failed to delete messages');
        setDeleting(false);
        return;
      }

      // Delete room
      const deleteRoomResponse = await deleteRecord(supabase, {
        table: 'chat_rooms',
        filters: { id: roomId }
      });

      if (deleteRoomResponse.status !== 'success') {
        setError('Failed to delete room');
        setDeleting(false);
        return;
      }

      // Redirect to chat home
      onClose?.();
      router.push('/chat');
    } catch (error) {
      setError('An error occurred while deleting room');
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium text-gray-900 dark:text-white">
        Danger Zone
      </h3>
      
      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Delete Room
        </button>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Are you sure you want to delete this room? This action cannot be undone and will delete all messages.
          </p>
          <div className="flex space-x-2">
            <button
              onClick={handleDeleteRoom}
              disabled={deleting}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleting ? 'Deleting...' : 'Yes, Delete'}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              disabled={deleting}
              className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
