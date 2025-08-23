export interface ChatMessage {
  id: string;
  room_id: string;
  user_id: string;
  body?: string;
  created_at: string;
  edited_at?: string;
  deleted_at?: string;
}

export interface CreateChatMessageData {
  room_id: string;
  body?: string;
}

export interface UpdateChatMessageData {
  body?: string;
}
