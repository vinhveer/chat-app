'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/data/auth';
import { MemberController } from '@/data/controllers/member';
import { RoomController } from '@/data/controllers/room';
import { OperationStatus } from '@/data/controllers/base/status';
import { SearchSkeleton } from './skeleton-loading';
import { getUserDisplayName, getUserInitials } from '@/utils/user-display';

interface SearchResult {
  type: 'user' | 'room';
  id: string;
  name: string;
  subtitle: string;
  href: string;
}

export function SidebarHeader() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Format user info
  const userInfo = {
    displayName: getUserDisplayName(user),
    email: user?.email || '',
    initials: getUserInitials(user)
  };

  // Handle click outside to close search results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    setShowResults(true);

    try {
      // Search users and rooms in parallel
      const [usersResponse, roomsResponse] = await Promise.all([
        MemberController.searchMembers({ query }),
        RoomController.searchRooms({ query })
      ]);

      const results: SearchResult[] = [];

      // Add user results
      if (usersResponse.status === OperationStatus.SUCCESS && usersResponse.data) {
        usersResponse.data.forEach(user => {
          results.push({
            type: 'user',
            id: user.id,
            name: user.displayName || 'Unknown User',
            subtitle: user.email || '',
            href: `/direct/${user.id}` // Assuming direct message functionality
          });
        });
      }

      // Add room results
      if (roomsResponse.status === OperationStatus.SUCCESS && roomsResponse.data) {
        roomsResponse.data.forEach(room => {
          results.push({
            type: 'room',
            id: room.id,
            name: room.name || 'Unnamed Room',
            subtitle: 'Chat Room',
            href: `/${room.id}`
          });
        });
      }

      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  const handleResultClick = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  if (!user) return null;

  return (
    <div className="p-3 border-b border-gray-200 dark:border-gray-800">
      {/* User Info */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full font-medium">
          {userInfo.initials}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {userInfo.displayName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {userInfo.email}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative" ref={searchRef}>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search users and rooms..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {isSearching ? (
              <SearchSkeleton />
            ) : (
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>
        </div>

        {/* Search Results */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-64 overflow-y-auto z-50">
            {searchResults.map((result) => (
              <Link
                key={`${result.type}-${result.id}`}
                href={result.href}
                onClick={handleResultClick}
                className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left first:rounded-t-lg last:rounded-b-lg"
              >
                <div className="flex-shrink-0">
                  {result.type === 'user' ? (
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                      {result.name.charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {result.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {result.subtitle}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className="text-xs text-gray-400 dark:text-gray-500 capitalize">
                    {result.type}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* No Results */}
        {showResults && searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 z-50">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              No users or rooms found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
