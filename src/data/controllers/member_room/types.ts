import { OperationStatus, ErrorType } from '../base/status';

export interface RoomMember {
  id: string;
  room_id: string;
  user_id: string;
  created_at: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  is_direct: boolean;
  created_by: string;
  created_at: string;
}

export interface CreateRoomWithMembersRequest {
  name: string;
  memberIds: string[];
}

export interface CreateRoomWithMembersResponse {
  status: OperationStatus;
  data: ChatRoom | null;
  errorType?: ErrorType;
  message?: string;
}

export interface GetRoomMembersRequest {
  roomId: string;
}

export interface GetRoomMembersResponse {
  status: OperationStatus;
  data: RoomMember[] | null;
  errorType?: ErrorType;
  message?: string;
}

export interface AddMemberToRoomRequest {
  roomId: string;
  userId: string;
}

export interface AddMemberToRoomResponse {
  status: OperationStatus;
  data: RoomMember | null;
  errorType?: ErrorType;
  message?: string;
}

export interface RemoveMemberFromRoomRequest {
  roomId: string;
  userId: string;
}

export interface RemoveMemberFromRoomResponse {
  status: OperationStatus;
  data: null;
  errorType?: ErrorType;
  message?: string;
}
