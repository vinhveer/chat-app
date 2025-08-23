import { SupabaseClient } from '@supabase/supabase-js';
import { BaseResponse, createSuccessResponse, createUnauthorizedResponse, createErrorResponse, ErrorType } from './status';

export interface CurrentUser {
  id: string;
  email?: string;
  user_metadata?: {
    displayName?: string;
    [key: string]: any;
  };
}

export async function getCurrentUser(supabase: SupabaseClient): Promise<BaseResponse<CurrentUser>> {
  try {
    const { data: user, error } = await supabase.auth.getUser();
    
    if (error || !user.user) {
      return createUnauthorizedResponse(ErrorType.USER_NOT_AUTHENTICATED, 'User not authenticated');
    }

    return createSuccessResponse({
      id: user.user.id,
      email: user.user.email,
      user_metadata: user.user.user_metadata
    }, 'User authenticated successfully');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Authentication check failed';
    return createErrorResponse(ErrorType.UNKNOWN_ERROR, message);
  }
}
