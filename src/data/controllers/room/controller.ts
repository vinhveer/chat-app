import { supabase } from '@/lib/supabase';
import { 
  read,
  getCurrentUser,
  createUnauthorizedResponse,
  createErrorResponse,
  createSuccessResponse,
  ErrorType
} from '../base';
import {
  GetRoomIdsByMemberIdRequest,
  GetRoomIdsByMemberIdResponse,
  GetRoomInfoRequest,
  GetRoomInfoResponse,
  SearchRoomsRequest,
  SearchRoomsResponse,
  ChatRoom
} from './types';

export class RoomController {
  static async searchRooms(request: SearchRoomsRequest): Promise<SearchRoomsResponse> {
    try {
      const userResponse = await getCurrentUser(supabase);
      if (userResponse.status !== 'success' || !userResponse.data) {
        return createUnauthorizedResponse(ErrorType.USER_NOT_AUTHENTICATED, 'User not authenticated');
      }

      const currentUserId = userResponse.data.id;

      // First get user's room IDs
      const membershipResponse = await read(supabase, {
        table: 'chat_room_members',
        select: 'room_id',
        filters: { user_id: currentUserId }
      });

      if (membershipResponse.status !== 'success') {
        return createErrorResponse(ErrorType.QUERY_FAILED, membershipResponse.message || 'Failed to get room memberships');
      }

      const userRoomIds = (membershipResponse.data || []).map((m: any) => m.room_id);

      if (userRoomIds.length === 0) {
        return createSuccessResponse([], 'No rooms found for user');
      }

      // Search in user's rooms only
      const roomsResponse = await read<ChatRoom>(supabase, {
        table: 'chat_rooms',
        select: 'id, name, is_direct, created_by, created_at',
        inFilters: { id: userRoomIds },
        orderBy: { column: 'created_at', ascending: false }
      });

      if (roomsResponse.status !== 'success') {
        return createErrorResponse(ErrorType.QUERY_FAILED, roomsResponse.message || 'Failed to search rooms');
      }

      // Filter rooms by name containing query
      const filteredRooms = (roomsResponse.data || []).filter(room => 
        room.name?.toLowerCase().includes(request.query.toLowerCase())
      );

      return createSuccessResponse(filteredRooms, 'Rooms search completed successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to search rooms';
      return createErrorResponse(ErrorType.QUERY_FAILED, message);
    }
  }

  static async getRoomIdsByMemberId(request: GetRoomIdsByMemberIdRequest): Promise<GetRoomIdsByMemberIdResponse> {
    try {
      let memberId = request.memberId;
      
      // If no memberId provided, use current user
      if (!memberId) {
        const userResponse = await getCurrentUser(supabase);
        if (userResponse.status !== 'success' || !userResponse.data) {
          return createUnauthorizedResponse(ErrorType.USER_NOT_AUTHENTICATED, 'User not authenticated');
        }
        memberId = userResponse.data.id;
      }

      const membershipResponse = await read(supabase, {
        table: 'chat_room_members',
        select: 'room_id',
        filters: { user_id: memberId }
      });

      if (membershipResponse.status !== 'success') {
        return createErrorResponse(ErrorType.QUERY_FAILED, membershipResponse.message || 'Failed to get room memberships');
      }

      const roomIds = (membershipResponse.data || []).map((m: any) => m.room_id);
      return createSuccessResponse(roomIds, 'Room IDs retrieved successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get room IDs';
      return createErrorResponse(ErrorType.QUERY_FAILED, message);
    }
  }

  static async getRoomInfo(request: GetRoomInfoRequest): Promise<GetRoomInfoResponse> {
    try {
      const isArray = Array.isArray(request.roomIds);
      const roomIds = isArray ? request.roomIds : [request.roomIds];

      if (roomIds.length === 0) {
        return createSuccessResponse(isArray ? [] : null, 'No room IDs provided');
      }

      const roomsResponse = await read<ChatRoom>(supabase, {
        table: 'chat_rooms',
        select: 'id, name, is_direct, created_by, created_at',
        inFilters: { id: roomIds as string[] },
        orderBy: { column: 'created_at', ascending: false }
      });

      if (roomsResponse.status !== 'success') {
        return createErrorResponse(ErrorType.QUERY_FAILED, roomsResponse.message || 'Failed to get room info');
      }

      const rooms = roomsResponse.data || [];
      
      if (isArray) {
        return createSuccessResponse(rooms, 'Room info retrieved successfully');
      } else {
        const room = rooms.length > 0 ? rooms[0] : null;
        return createSuccessResponse(room, room ? 'Room info retrieved successfully' : 'Room not found');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get room info';
      return createErrorResponse(ErrorType.QUERY_FAILED, message);
    }
  }


}
