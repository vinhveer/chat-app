import { SupabaseClient } from '@supabase/supabase-js';
import { BaseResponse, createSuccessResponse, createErrorResponse, ErrorType } from './status';
import { getUserDisplayName } from '@/utils/user-display';
import { User, UserProfile, mapAuthUserToProfile } from '@/data/models/user';

export async function searchUsers(supabase: SupabaseClient, query: string): Promise<BaseResponse<UserProfile[]>> {
  try {
    const { data, error } = await supabase.rpc('search_users', { search_query: query });
    
    if (error) {
      return createErrorResponse(ErrorType.MEMBER_SEARCH_FAILED, `Search failed: ${error.message}`);
    }

    // Map the returned users to UserProfile format
    const userProfiles: UserProfile[] = data.map((user: User) => mapAuthUserToProfile(user));
    
    return createSuccessResponse(userProfiles, 'Users found successfully');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Search failed';
    return createErrorResponse(ErrorType.MEMBER_SEARCH_FAILED, message);
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
      return createErrorResponse(ErrorType.MEMBER_NOT_FOUND, `User lookup failed: ${error.message}`);
    }

    if (!data) {
      return createErrorResponse(ErrorType.MEMBER_NOT_FOUND, 'User not found');
    }

    const userProfile = mapAuthUserToProfile(data);
    return createSuccessResponse(userProfile, 'User found successfully');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get user';
    return createErrorResponse(ErrorType.MEMBER_NOT_FOUND, message);
  }
}

export async function getUsersByIds(userIds: string[]): Promise<Record<string, { email: string; displayName: string }>> {
  try {
    const { supabaseAdmin } = await import('@/lib/supabase');
    
    if (!supabaseAdmin) {
      throw new Error('Supabase admin client not available');
    }

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return {};
    }

    const usersResponse = await supabaseAdmin.auth.admin.listUsers();
    
    if (usersResponse.error) {
      console.error('Failed to fetch users:', usersResponse.error);
      throw new Error(`Failed to fetch users: ${usersResponse.error.message}`);
    }

    const usersMap: Record<string, { email: string; displayName: string }> = {};
    
    if (usersResponse.data?.users) {
      usersResponse.data.users.forEach(user => {
        if (userIds.includes(user.id)) {
          const displayName = getUserDisplayName(user as any);
          
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
    throw error;
  }
}
