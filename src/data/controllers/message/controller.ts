import { supabase, supabaseAdmin } from '@/lib/supabase';
import { getUserDisplayName } from '@/utils/user-display';


import { 
  create, 
  read, 
  update,
  getCurrentUser,
  createUnauthorizedResponse,
  createSuccessResponse,
  createErrorResponse,
  ErrorType
} from '../base';
import {
  GetMessagesRequest,
  GetMessagesResponse,
  SendMessageRequest,
  SendMessageResponse,
  EditMessageRequest,
  EditMessageResponse,
  DeleteMessageRequest,
  DeleteMessageResponse,
  SubscribeToMessagesRequest,
  ChatMessage
} from './types';

export class MessageController {
  static async getMessages(request: GetMessagesRequest): Promise<GetMessagesResponse> {
    try {
      const messagesResponse = await read<ChatMessage>(supabase, {
        table: 'chat_messages',
        select: 'id, room_id, user_id, body, created_at, edited_at, deleted_at',
        filters: { room_id: request.roomId },
        isNull: ['deleted_at'],
        orderBy: { column: 'created_at', ascending: true }
      });

      if (messagesResponse.status !== 'success') {
        return createErrorResponse(ErrorType.QUERY_FAILED, messagesResponse.message || 'Failed to get messages');
      }

      // Get user information for messages
      const userIds = [...new Set((messagesResponse.data || []).map(m => m.user_id))];
      const usersMap = new Map();
      
      if (userIds.length > 0) {
        try {
          const { getUsersByIds } = await import('@/data/controllers/base/user');
          const users = await getUsersByIds(userIds);
          Object.entries(users).forEach(([userId, userData]) => {
            usersMap.set(userId, userData);
          });
        } catch (error) {
          console.error('Error getting users:', error);
        }
      }



      const messagesWithUsers = (messagesResponse.data || []).map(message => {
        const userInfo = usersMap.get(message.user_id);

        return {
          ...message,
          user: userInfo || {
            email: '',
            displayName: 'Unknown User'
          }
        };
      });

      return createSuccessResponse(messagesWithUsers, 'Messages retrieved successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to get messages';
      return createErrorResponse(ErrorType.QUERY_FAILED, message);
    }
  }

  static async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    try {
      const userResponse = await getCurrentUser(supabase);
      if (userResponse.status !== 'success' || !userResponse.data) {
        return createUnauthorizedResponse(ErrorType.USER_NOT_AUTHENTICATED, 'User not authenticated');
      }

      const currentUserId = userResponse.data.id;
      const currentUserEmail = userResponse.data.email;

      const messageResponse = await create<ChatMessage>(supabase, {
        table: 'chat_messages',
        data: {
          room_id: request.room_id,
          user_id: currentUserId,
          body: request.body.trim()
        } as any,
        select: '*'
      });

      if (messageResponse.status !== 'success' || !messageResponse.data) {
        return createErrorResponse(ErrorType.QUERY_FAILED, messageResponse.message || 'Failed to send message');
      }

      const message = Array.isArray(messageResponse.data) ? messageResponse.data[0] : messageResponse.data;

      const messageWithUser = {
        ...message,
        user: {
          email: currentUserEmail || '',
          displayName: getUserDisplayName(userResponse.data as any)
        }
      };

      return createSuccessResponse(messageWithUser, 'Message sent successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send message';
      return createErrorResponse(ErrorType.QUERY_FAILED, message);
    }
  }

  static async editMessage(request: EditMessageRequest): Promise<EditMessageResponse> {
    try {
      const updateResponse = await update<ChatMessage>(supabase, {
        table: 'chat_messages',
        data: {
          body: request.newBody.trim(),
          edited_at: new Date().toISOString()
        } as any,
        filters: { id: request.messageId },
        select: '*'
      });

      if (updateResponse.status !== 'success' || !updateResponse.data) {
        return createErrorResponse(ErrorType.QUERY_FAILED, updateResponse.message || 'Failed to edit message');
      }

      const message = Array.isArray(updateResponse.data) ? updateResponse.data[0] : updateResponse.data;
      return createSuccessResponse(message, 'Message edited successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to edit message';
      return createErrorResponse(ErrorType.QUERY_FAILED, message);
    }
  }

  static async deleteMessage(request: DeleteMessageRequest): Promise<DeleteMessageResponse> {
    try {
      const updateResponse = await update(supabase, {
        table: 'chat_messages',
        data: {
          deleted_at: new Date().toISOString()
        },
        filters: { id: request.messageId }
      });

      if (updateResponse.status !== 'success') {
        return createErrorResponse(ErrorType.QUERY_FAILED, updateResponse.message || 'Failed to delete message');
      }

      return createSuccessResponse(null, 'Message deleted successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete message';
      return createErrorResponse(ErrorType.QUERY_FAILED, message);
    }
  }

  static subscribeToMessages(request: SubscribeToMessagesRequest) {
    return supabase
      .channel(`messages:${request.roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${request.roomId}`
        },
        async (payload) => {
          const newMessage = payload.new as ChatMessage;
          
          // Get user info for the new message
          try {
            const { getUsersByIds } = await import('@/data/controllers/base/user');
            const users = await getUsersByIds([newMessage.user_id]);
            const userInfo = users[newMessage.user_id];
            
            newMessage.user = userInfo || {
              email: '',
              displayName: 'Unknown User'
            };
          } catch {
            newMessage.user = {
              email: '',
              displayName: 'Unknown User'
            };
          }
          
          request.callback(newMessage);
        }
      )
      .subscribe();
  }
}
