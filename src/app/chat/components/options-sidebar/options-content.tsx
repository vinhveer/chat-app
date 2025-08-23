'use client';

import { MemberListSection } from './member-list-section';
import { AddMemberSection } from './add-member-section';
import { DeleteRoomSection } from './delete-room-section';

interface OptionsContentProps {
  roomId: string;
  onClose?: () => void;
}

export function OptionsContent({ roomId, onClose }: OptionsContentProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {/* Member List Section */}
      <MemberListSection roomId={roomId} />
      
      {/* Add Member Section */}
      <AddMemberSection roomId={roomId} />
      
      {/* Delete Room Section */}
      <DeleteRoomSection roomId={roomId} onClose={onClose} />
    </div>
  );
}
