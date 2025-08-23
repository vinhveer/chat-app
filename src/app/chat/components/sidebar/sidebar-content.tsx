import { SidebarSection } from './sidebar-section';
import { AccountSection, CreateRoomItem, RoomList } from './sidebar-menu-items';
import { RoomListSkeleton } from './skeleton-loading';
import { ChatRoom } from '@/data/controllers/room';

interface SidebarContentProps {
  rooms: ChatRoom[];
  loading: boolean;
  onClose?: () => void;
}

export function SidebarContent({ rooms, loading, onClose }: SidebarContentProps) {
  return (
    <div className="flex-1 overflow-y-auto p-2">
      {/* Account Section */}
      <SidebarSection title="Account">
        <AccountSection onClose={onClose} />
      </SidebarSection>

      {/* Rooms Section */}
      <SidebarSection title="Chat Rooms">
        <CreateRoomItem onClose={onClose} />
        
        {loading ? (
          <RoomListSkeleton />
        ) : (
          <RoomList rooms={rooms} onClose={onClose} />
        )}
      </SidebarSection>
    </div>
  );
}
