import { OperationStatus, ErrorType } from '../base/status';

export interface ChatMessage {
  id: string;
  room_id: string;
  user_id: string;
  body?: string;
  created_at: string;
  edited_at?: string;
  deleted_at?: string;
  user?: {
    email: string;
    displayName: string;
  };
}

export interface SendMessageData {
  room_id: string;
  body: string;
}

export interface GetMessagesRequest {
  roomId: string;
}

export interface GetMessagesResponse {
  status: OperationStatus;
  data: ChatMessage[] | null;
  errorType?: ErrorType;
  message?: string;
}

export interface SendMessageRequest {
  room_id: string;
  body: string;
}

export interface SendMessageResponse {
  status: OperationStatus;
  data: ChatMessage | null;
  errorType?: ErrorType;
  message?: string;
}

export interface EditMessageRequest {
  messageId: string;
  newBody: string;
}

export interface EditMessageResponse {
  status: OperationStatus;
  data: ChatMessage | null;
  errorType?: ErrorType;
  message?: string;
}

export interface DeleteMessageRequest {
  messageId: string;
}

export interface DeleteMessageResponse {
  status: OperationStatus;
  data: null;
  errorType?: ErrorType;
  message?: string;
}

export interface SubscribeToMessagesRequest {
  roomId: string;
  callback: (message: ChatMessage) => void;
}
