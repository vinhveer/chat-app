'use client';

import { useState } from 'react';
import { MemberController, Member } from '@/data/controllers/member';
import { MemberRoomController } from '@/data/controllers/member_room';
import { OperationStatus } from '@/data/controllers/base/status';

interface AddMemberSectionProps {
  roomId: string;
}

export function AddMemberSection({ roomId }: AddMemberSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Member[]>([]);
  const [searching, setSearching] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const handleSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    const response = await MemberController.searchMembers({ query });
    
    if (response.status !== OperationStatus.SUCCESS) {
      setMessage(response.message || 'Search failed');
    } else {
      setSearchResults(response.data || []);
    }
    setSearching(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setMessage('');
    handleSearch(query);
  };

  const handleAddMember = async (member: Member) => {
    setAdding(member.id);
    setMessage('');

    const response = await MemberRoomController.addMemberToRoom({
      roomId,
      userId: member.id
    });

    if (response.status === OperationStatus.SUCCESS) {
      setMessage(`Added ${member.displayName} to room`);
      setSearchQuery('');
      setSearchResults([]);
    } else {
      setMessage(response.message || 'Failed to add member');
    }
    setAdding(null);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium text-gray-900 dark:text-white">
        Add Members
      </h3>
      
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search users..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searching && (
          <div className="absolute right-3 top-2.5">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {searchResults.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {member.displayName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {member.displayName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {member.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleAddMember(member)}
                disabled={adding === member.id}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {adding === member.id ? 'Adding...' : 'Add'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Message */}
      {message && (
        <p className={`text-sm ${message.includes('Added') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
