'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageController, ChatMessage } from '@/data/controllers/message';
import { RoomController, ChatRoom } from '@/data/controllers/room';
import { OperationStatus } from '@/data/controllers/base/status';
import { useAuth } from '@/data/auth';

export function useChatRoom(roomId: string) {
  const { user } = useAuth();
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    if (roomId) {
      loadRoomAndMessages();
      setupRealtimeSubscription();
    }

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadRoomAndMessages = async () => {
    setLoading(true);
    
    // Load room info
    const roomResponse = await RoomController.getRoomInfo({ roomIds: [roomId] });
    if (roomResponse.status === OperationStatus.SUCCESS && roomResponse.data) {
      const roomData = Array.isArray(roomResponse.data) ? roomResponse.data[0] : roomResponse.data;
      setRoom(roomData);
    }
    
    // Load messages
    const messagesResponse = await MessageController.getMessages({ roomId });
    if (messagesResponse.status !== OperationStatus.SUCCESS) {
      setError(messagesResponse.message || 'Failed to load messages');
    } else {
      setMessages(messagesResponse.data || []);
    }
    
    setLoading(false);
  };

  const setupRealtimeSubscription = () => {
    subscriptionRef.current = MessageController.subscribeToMessages({
      roomId,
      callback: (newMessage) => {
        setMessages(prev => [...prev, newMessage]);
      }
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    setSending(true);
    setError('');

    const response = await MessageController.sendMessage({
      room_id: roomId,
      body: newMessage.trim()
    });

    if (response.status !== OperationStatus.SUCCESS) {
      setError(response.message || 'Failed to send message');
    } else {
      setNewMessage('');
    }
    
    setSending(false);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isMyMessage = (message: ChatMessage) => {
    return message.user_id === user?.id;
  };

  return {
    room,
    messages,
    newMessage,
    setNewMessage,
    loading,
    sending,
    error,
    messagesEndRef,
    handleSendMessage,
    formatTime,
    isMyMessage
  };
}
