'use client';

import { useState } from 'react';
import { MemberListSection } from './member-list-section';
import { AddMemberSection } from './add-member-section';
import { DeleteRoomSection } from './delete-room-section';

interface OptionsContentProps {
  roomId: string;
  onClose?: () => void;
}

export function OptionsContent({ roomId, onClose }: OptionsContentProps) {
  const [refreshMembers, setRefreshMembers] = useState<(() => void) | null>(null);

  const handleMemberAdded = () => {
    if (refreshMembers) {
      refreshMembers();
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {/* Member List Section */}
      <MemberListSection 
        roomId={roomId} 
        onRefreshMembers={setRefreshMembers}
      />
      
      {/* Add Member Section */}
      <AddMemberSection 
        roomId={roomId} 
        onMemberAdded={handleMemberAdded}
      />
      
      {/* Delete Room Section */}
      <DeleteRoomSection roomId={roomId} onClose={onClose} />
    </div>
  );
}
