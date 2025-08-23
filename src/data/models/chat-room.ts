export interface ChatRoom {
  id: string;
  name?: string;
  is_direct: boolean;
  created_by: string;
  created_at: string;
}

export interface CreateChatRoomData {
  name?: string;
  is_direct?: boolean;
}

export interface UpdateChatRoomData {
  name?: string;
}
