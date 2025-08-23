export interface ChatRoomMember {
  room_id: string;
  user_id: string;
  joined_at: string;
}

export interface CreateChatRoomMemberData {
  room_id: string;
  user_id: string;
}
