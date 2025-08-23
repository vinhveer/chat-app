import { OperationStatus, ErrorType } from '../base/status';

export interface ChatRoom {
  id: string;
  name?: string;
  is_direct: boolean;
  created_by: string;
  created_at: string;
}



export interface GetRoomIdsByMemberIdRequest {
  memberId?: string; // Optional, uses current user if not provided
}

export interface GetRoomIdsByMemberIdResponse {
  status: OperationStatus;
  data: string[] | null;
  errorType?: ErrorType;
  message?: string;
}

export interface GetRoomInfoRequest {
  roomIds: string | string[]; // Single ID or array of IDs
}

export interface GetRoomInfoResponse {
  status: OperationStatus;
  data: ChatRoom | ChatRoom[] | null;
  errorType?: ErrorType;
  message?: string;
}

export interface SearchRoomsRequest {
  query: string;
}

export interface SearchRoomsResponse {
  status: OperationStatus;
  data: ChatRoom[] | null;
  errorType?: ErrorType;
  message?: string;
}


