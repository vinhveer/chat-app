import { supabase } from '@/lib/supabase';
import { 
  createSuccessResponse,
  createErrorResponse,
  ErrorType,
  searchUsers,
  getUserByEmail
} from '../base';
import {
  SearchMembersRequest,
  SearchMembersResponse,
  GetMemberByEmailRequest,
  GetMemberByEmailResponse,
  Member
} from './types';

export class MemberController {
  static async searchMembers(request: SearchMembersRequest): Promise<SearchMembersResponse> {
    try {
      const response = await searchUsers(supabase, request.query);
      return {
        status: response.status,
        data: response.data,
        errorType: response.errorType,
        message: response.message
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to search members';
      return createErrorResponse(ErrorType.MEMBER_SEARCH_FAILED, message);
    }
  }

  static async getMemberByEmail(request: GetMemberByEmailRequest): Promise<GetMemberByEmailResponse> {
    try {
      const response = await getUserByEmail(supabase, request.email);
      return {
        status: response.status,
        data: response.data,
        errorType: response.errorType,
        message: response.message
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get member';
      return createErrorResponse(ErrorType.MEMBER_NOT_FOUND, message);
    }
  }


}
