export interface ChatAttachment {
  id: string;
  message_id: string;
  file_path: string;
  mime_type?: string;
  size_bytes?: number;
  created_at: string;
}

export interface CreateChatAttachmentData {
  message_id: string;
  file_path: string;
  mime_type?: string;
  size_bytes?: number;
}
