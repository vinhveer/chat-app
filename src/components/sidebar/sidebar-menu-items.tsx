import { useEffect } from 'react';
import { SidebarItem } from './sidebar-item';
import { SettingsIcon, PlusIcon, ChatIcon } from '@/app/components/ui/icons';
import { ChatRoom } from '@/data/controllers/room';
import { useProgressivePrefetch } from '@/hooks/use-progressive-prefetch';

interface AccountSectionProps {
  onClose?: () => void;
}

export function AccountSection({ onClose: _onClose }: AccountSectionProps) {
  return (
    <SidebarItem
      href="/account"
      keepSidebarOpen={true} // Account settings should keep sidebar open
      icon={<SettingsIcon />}
    >
      Account Settings
    </SidebarItem>
  );
}

interface CreateRoomItemProps {
  onClose?: () => void;
}

export function CreateRoomItem({ onClose }: CreateRoomItemProps) {
  return (
    <SidebarItem
      href="/create"
      onClick={onClose}
      icon={<PlusIcon />}
    >
      Create Room
    </SidebarItem>
  );
}

interface RoomListProps {
  rooms: ChatRoom[];
  onClose?: () => void;
}

export function RoomList({ rooms, onClose }: RoomListProps) {
  const { prefetchRoomRoutes } = useProgressivePrefetch();

  // Prefetch room routes when rooms are loaded
  useEffect(() => {
    if (rooms.length > 0) {
      const roomIds = rooms.map(room => room.id);
      prefetchRoomRoutes(roomIds);
    }
  }, [rooms, prefetchRoomRoutes]);

  if (rooms.length === 0) {
    return (
      <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400">
        No rooms yet
      </div>
    );
  }

  return (
    <>
      {rooms.map((room) => (
        <SidebarItem
          key={room.id}
          href={`/${room.id}`}
          onClick={onClose}
          icon={<ChatIcon />}
          subtitle="Message"
        >
          {room.name || 'Unnamed Room'}
        </SidebarItem>
      ))}
    </>
  );
}
