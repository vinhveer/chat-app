import { supabase } from '@/lib/supabase';
import { 
  create, 
  read, 
  deleteRecord,
  getCurrentUser,
  createSuccessResponse,
  createErrorResponse,
  createUnauthorizedResponse,
  ErrorType
} from '../base';
import {
  GetRoomMembersRequest,
  GetRoomMembersResponse,
  AddMemberToRoomRequest,
  AddMemberToRoomResponse,
  RemoveMemberFromRoomRequest,
  RemoveMemberFromRoomResponse,
  CreateRoomWithMembersRequest,
  CreateRoomWithMembersResponse,
  RoomMember,
  ChatRoom
} from './types';

export class MemberRoomController {
  static async createRoomWithMembers(request: CreateRoomWithMembersRequest): Promise<CreateRoomWithMembersResponse> {
    try {
      const userResponse = await getCurrentUser(supabase);
      if (userResponse.status !== 'success' || !userResponse.data) {
        return createUnauthorizedResponse(ErrorType.USER_NOT_AUTHENTICATED, 'User not authenticated');
      }

      const currentUserId = userResponse.data.id;

      // Create the room
      const roomResponse = await create<ChatRoom>(supabase, {
        table: 'chat_rooms',
        data: {
          name: request.name,
          is_direct: false,
          created_by: currentUserId
        } as any,
        select: '*'
      });

      if (roomResponse.status !== 'success' || !roomResponse.data) {
        return createErrorResponse(ErrorType.ROOM_CREATION_FAILED, roomResponse.message || 'Failed to create room');
      }

      const room = Array.isArray(roomResponse.data) ? roomResponse.data[0] : roomResponse.data;

      // Add creator as member
      const creatorMemberResponse = await create(supabase, {
        table: 'chat_room_members',
        data: {
          room_id: room.id,
          user_id: currentUserId
        } as any
      });

      if (creatorMemberResponse.status !== 'success') {
        console.error('Failed to add creator as member:', creatorMemberResponse.message);
      }

      // Add selected members
      const memberPromises = request.memberIds.map(memberId =>
        create(supabase, {
          table: 'chat_room_members',
          data: {
            room_id: room.id,
            user_id: memberId
          } as any
        })
      );

      const memberResults = await Promise.allSettled(memberPromises);
      const failedMembers = memberResults.filter(result => 
        result.status === 'rejected' || 
        (result.status === 'fulfilled' && result.value.status !== 'success')
      );

      if (failedMembers.length > 0) {
        console.warn(`Failed to add ${failedMembers.length} members to room ${room.id}`);
      }

      return createSuccessResponse(room, 'Room created with members successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Room creation failed';
      return createErrorResponse(ErrorType.ROOM_CREATION_FAILED, message);
    }
  }
  static async getRoomMembers(request: GetRoomMembersRequest): Promise<GetRoomMembersResponse> {
    try {
      const membersResponse = await read<RoomMember>(supabase, {
        table: 'chat_room_members',
        select: '*',
        filters: { room_id: request.roomId }
      });

      if (membersResponse.status !== 'success') {
        return createErrorResponse(ErrorType.QUERY_FAILED, membersResponse.message || 'Failed to get room members');
      }

      return createSuccessResponse(membersResponse.data || [], 'Room members retrieved successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get room members';
      return createErrorResponse(ErrorType.QUERY_FAILED, message);
    }
  }

  static async addMemberToRoom(request: AddMemberToRoomRequest): Promise<AddMemberToRoomResponse> {
    try {
      const memberResponse = await create<RoomMember>(supabase, {
        table: 'chat_room_members',
        data: {
          room_id: request.roomId,
          user_id: request.userId
        } as any,
        select: '*'
      });

      if (memberResponse.status !== 'success') {
        if (memberResponse.errorType === ErrorType.DUPLICATE_ENTRY) {
          return createErrorResponse(ErrorType.ALREADY_ROOM_MEMBER, 'User is already a member of this room');
        }
        return createErrorResponse(ErrorType.MEMBER_ADD_FAILED, memberResponse.message || 'Failed to add member to room');
      }

      const member = Array.isArray(memberResponse.data) ? memberResponse.data[0] : memberResponse.data;
      return createSuccessResponse(member, 'Member added to room successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add member to room';
      return createErrorResponse(ErrorType.MEMBER_ADD_FAILED, message);
    }
  }

  static async removeMemberFromRoom(request: RemoveMemberFromRoomRequest): Promise<RemoveMemberFromRoomResponse> {
    try {
      const deleteResponse = await deleteRecord(supabase, {
        table: 'chat_room_members',
        filters: {
          room_id: request.roomId,
          user_id: request.userId
        }
      });

      if (deleteResponse.status !== 'success') {
        return createErrorResponse(ErrorType.QUERY_FAILED, deleteResponse.message || 'Failed to remove member from room');
      }

      return createSuccessResponse(null, 'Member removed from room successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to remove member from room';
      return createErrorResponse(ErrorType.QUERY_FAILED, message);
    }
  }
}
