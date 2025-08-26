'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MemberController, Member } from '@/data/controllers/member';
import { MemberRoomController } from '@/data/controllers/member_room';
import { OperationStatus } from '@/data/controllers/base/status';

export function useCreateRoom() {
  const router = useRouter();
  const [roomName, setRoomName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Member[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    const response = await MemberController.searchMembers({ query });
    
    if (response.status !== OperationStatus.SUCCESS) {
      setError(response.message || 'Search failed');
    } else {
      setSearchResults(response.data || []);
    }
    setSearching(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  const handleSelectMember = (member: Member) => {
    if (!selectedMembers.find(m => m.id === member.id)) {
      setSelectedMembers([...selectedMembers, member]);
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleRemoveMember = (memberId: string) => {
    setSelectedMembers(selectedMembers.filter(m => m.id !== memberId));
  };

  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      setError('Room name is required');
      return;
    }

    setLoading(true);
    setError('');

    const response = await MemberRoomController.createRoomWithMembers({
      name: roomName.trim(),
      memberIds: selectedMembers.map(m => m.id)
    });

    if (response.status !== OperationStatus.SUCCESS) {
      setError(response.message || 'Failed to create room');
    } else {
      // Redirect to the created room
      const roomId = response.data?.id;
      if (roomId) {
        router.push(`/${roomId}`);
      } else {
        router.push('/chat');
      }
    }
    setLoading(false);
  };

  return {
    roomName,
    setRoomName,
    searchQuery,
    setSearchQuery,
    searchResults,
    selectedMembers,
    loading,
    searching,
    error,
    handleSearchChange,
    handleSelectMember,
    handleRemoveMember,
    handleCreateRoom
  };
}
