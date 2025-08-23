'use client';

import { forwardRef, HTMLAttributes, useEffect, useState } from 'react';
import { Sidebar } from './sidebar';
import { SidebarSection } from './sidebar-section';
import { SidebarItem } from './sidebar-item';
import { UserAccount } from '../auth/user-account';
import { RoomController, ChatRoom } from '@/data/controllers/room';
import { OperationStatus } from '@/data/controllers/base/status';

interface NavigationSidebarProps extends HTMLAttributes<HTMLDivElement> {
  isCollapsed?: boolean;
  width?: number;
  onToggleCollapse?: () => void;
}

const NavigationSidebar = forwardRef<HTMLDivElement, NavigationSidebarProps>(
  ({ className = '', isCollapsed = false, width, onToggleCollapse, ...props }, ref) => {
    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      loadRooms();
    }, []);

      const loadRooms = async () => {
    setLoading(true);
    console.log('Loading rooms for sidebar...');
    
    // First get room IDs for current user
    const roomIdsResponse = await RoomController.getRoomIdsByMemberId({});
    console.log('Room IDs result:', roomIdsResponse);
    
    if (roomIdsResponse.status !== OperationStatus.SUCCESS || !roomIdsResponse.data || roomIdsResponse.data.length === 0) {
      console.log('No rooms found for user');
      setRooms([]);
      setLoading(false);
      return;
    }
    
    // Then get room info for those IDs
    const roomInfoResponse = await RoomController.getRoomInfo({ roomIds: roomIdsResponse.data });
    console.log('Room info result:', roomInfoResponse);
    
    if (roomInfoResponse.status === OperationStatus.SUCCESS && roomInfoResponse.data) {
      const rooms = Array.isArray(roomInfoResponse.data) ? roomInfoResponse.data : [roomInfoResponse.data];
      setRooms(rooms);
    } else {
      console.error('Failed to load room info:', roomInfoResponse.message);
      setRooms([]);
    }
    
    setLoading(false);
  };

  // Expose refresh function globally for other components
  useEffect(() => {
    (window as any).refreshRooms = loadRooms;
    return () => {
      delete (window as any).refreshRooms;
    };
  }, []);

    return (
      <Sidebar ref={ref} isCollapsed={isCollapsed} width={width} className={className} style={{ height: '100dvh' }} {...props}>
        <div className="flex flex-col" style={{ height: '100dvh' }}>
          {/* User Account Header */}
          <div className="border-b border-gray-200 dark:border-gray-800">
            <UserAccount />
          </div>

          {/* Rooms Section */}
          <div className="flex-1 overflow-y-auto p-2">
            <SidebarSection title="Chat Rooms" isCollapsed={isCollapsed}>
              {/* Create Room Button */}
              <SidebarItem
                href="/chat/create"
                isCollapsed={isCollapsed}
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                }
              >
                Create Room
              </SidebarItem>

              {/* Loading or Rooms List */}
              {loading ? (
                <SidebarItem
                  isCollapsed={isCollapsed}
                  icon={
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  }
                >
                  Loading...
                </SidebarItem>
              ) : rooms.length === 0 ? (
                <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400">
                  {isCollapsed ? '💬' : 'No rooms yet'}
                </div>
              ) : (
                rooms.map((room) => (
                  <SidebarItem
                    key={room.id}
                    href={`/chat/${room.id}`}
                    isCollapsed={isCollapsed}
                    icon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    }
                    subtitle="Tin nhắn"
                  >
                    {room.name || 'Unnamed Room'}
                  </SidebarItem>
                ))
              )}
            </SidebarSection>
          </div>

          {/* Collapse Button */}
          <div className="border-t border-gray-200 dark:border-gray-800 p-4">
            <button
              onClick={onToggleCollapse}
              className="w-full flex items-center justify-center p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
            >
              {isCollapsed ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </Sidebar>
    );
  }
);

NavigationSidebar.displayName = 'NavigationSidebar';

export { NavigationSidebar };
