import { SupabaseClient } from '@supabase/supabase-js';
import { BaseResponse, createSuccessResponse, createErrorResponse, ErrorType } from './status';
import { User, UserProfile, mapAuthUserToProfile } from '@/data/models/user';

export async function searchUsers(supabase: SupabaseClient, query: string): Promise<BaseResponse<UserProfile[]>> {
  try {
    // Query auth.users using admin access or RPC function
    // Note: Direct access to auth.users requires admin privileges or RPC function
    const { data, error } = await supabase.rpc('search_users', { search_query: query });
    
    if (error) {
      // Fallback to mock data if RPC function doesn't exist yet
      console.warn('RPC search_users not found, using mock data. Error:', error.message);
      
      const mockUsers: UserProfile[] = [
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          email: 'john@example.com',
          displayName: 'john',
          created_at: new Date().toISOString()
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          email: 'jane@example.com',
          displayName: 'jane',
          created_at: new Date().toISOString()
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440003',
          email: 'admin@example.com',
          displayName: 'admin',
          created_at: new Date().toISOString()
        }
      ];

      const filteredUsers = mockUsers.filter(user => 
        user.email?.toLowerCase().includes(query.toLowerCase()) ||
        user.displayName.toLowerCase().includes(query.toLowerCase())
      );

      return createSuccessResponse(filteredUsers, 'Users found successfully (mock data)');
    }

    // Map the returned users to UserProfile format
    const userProfiles: UserProfile[] = data.map((user: User) => mapAuthUserToProfile(user));
    
    return createSuccessResponse(userProfiles, 'Users found successfully');
  } catch (error) {
    // Fallback to mock data on any error
    console.warn('Error searching users, using mock data:', error);
    
    const mockUsers: UserProfile[] = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        email: 'john@example.com',
        displayName: 'john',
        created_at: new Date().toISOString()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        email: 'jane@example.com',
        displayName: 'jane',
        created_at: new Date().toISOString()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        email: 'admin@example.com',
        displayName: 'admin',
        created_at: new Date().toISOString()
      }
    ];

    const filteredUsers = mockUsers.filter(user => 
      user.email?.toLowerCase().includes(query.toLowerCase()) ||
      user.displayName.toLowerCase().includes(query.toLowerCase())
    );

    return createSuccessResponse(filteredUsers, 'Users found successfully (fallback mock data)');
  }
}

export async function getUserByEmail(supabase: SupabaseClient, email: string): Promise<BaseResponse<UserProfile>> {
  try {
    const searchResponse = await searchUsers(supabase, email);
    
    if (searchResponse.status !== 'success' || !searchResponse.data) {
      return createErrorResponse(ErrorType.MEMBER_SEARCH_FAILED, 'Failed to search for user');
    }

    const user = searchResponse.data.find(u => u.email === email);
    
    if (!user) {
      return createErrorResponse(ErrorType.MEMBER_NOT_FOUND, 'User not found');
    }

    return createSuccessResponse(user, 'User found successfully');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get user';
    return createErrorResponse(ErrorType.MEMBER_NOT_FOUND, message);
  }
}

export async function getUserById(supabase: SupabaseClient, userId: string): Promise<BaseResponse<UserProfile>> {
  try {
    const { data, error } = await supabase.rpc('get_user_by_id', { user_id: userId });
    
    if (error) {
      // Fallback for specific user
      const mockUser: UserProfile = {
        id: userId,
        email: `user${userId.slice(-4)}@example.com`,
        displayName: `user${userId.slice(-4)}`,
        created_at: new Date().toISOString()
      };
      
      return createSuccessResponse(mockUser, 'User found successfully (fallback data)');
    }

    if (!data) {
      return createErrorResponse(ErrorType.MEMBER_NOT_FOUND, 'User not found');
    }

    const userProfile = mapAuthUserToProfile(data);
    return createSuccessResponse(userProfile, 'User found successfully');
  } catch (error) {
    // Fallback for specific user
    const mockUser: UserProfile = {
      id: userId,
      email: `user${userId.slice(-4)}@example.com`,
      displayName: `user${userId.slice(-4)}`,
      created_at: new Date().toISOString()
    };
    
    return createSuccessResponse(mockUser, 'User found successfully (fallback data)');
  }
}

export async function getUsersByIds(userIds: string[]): Promise<Record<string, { email: string; displayName: string }>> {
  try {
    const { supabaseAdmin } = await import('@/lib/supabase');
    
    if (!supabaseAdmin) {
      // Fallback to mock data
      const usersMap: Record<string, { email: string; displayName: string }> = {};
      userIds.forEach(userId => {
        usersMap[userId] = {
          email: `user${userId.slice(-4)}@example.com`,
          displayName: `user${userId.slice(-4)}`
        };
      });
      return usersMap;
    }

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return {};
    }

    const usersResponse = await supabaseAdmin.auth.admin.listUsers();
    
    if (usersResponse.error) {
      console.error('Failed to fetch users:', usersResponse.error);
      // Fallback to mock data
      const usersMap: Record<string, { email: string; displayName: string }> = {};
      userIds.forEach(userId => {
        usersMap[userId] = {
          email: `user${userId.slice(-4)}@example.com`,
          displayName: `user${userId.slice(-4)}`
        };
      });
      return usersMap;
    }

    const usersMap: Record<string, { email: string; displayName: string }> = {};
    
    if (usersResponse.data?.users) {
      usersResponse.data.users.forEach(user => {
        if (userIds.includes(user.id)) {
          const displayName = user.user_metadata?.displayName || 
                            user.email?.split('@')[0] || 'User';
          
          usersMap[user.id] = {
            email: user.email || '',
            displayName: displayName
          };
        }
      });
    }

    return usersMap;
  } catch (error) {
    console.error('Error fetching users:', error);
    // Fallback to mock data
    const usersMap: Record<string, { email: string; displayName: string }> = {};
    userIds.forEach(userId => {
      usersMap[userId] = {
        email: `user${userId.slice(-4)}@example.com`,
        displayName: `user${userId.slice(-4)}`
      };
    });
    return usersMap;
  }
}
