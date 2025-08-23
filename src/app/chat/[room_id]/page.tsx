'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { ChatHeader, LoadingSpinner, MessageList, MessageInput, OptionsSidebar } from '../components';
import { useChatRoom } from '../hooks';

export default function ChatRoomPage() {
  const params = useParams();
  const roomId = params.room_id as string;
  const [optionsSidebarOpen, setOptionsSidebarOpen] = useState(false);
  
  const {
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
  } = useChatRoom(roomId);

  if (loading) {
    return <LoadingSpinner message="Loading chat..." />;
  }

  return (
    <div className="flex h-full">
      {/* Main Chat Area */}
      <div className="flex flex-col flex-1">
        <ChatHeader 
          title={room?.name || 'Chat Room'}
          onOptionsToggle={() => setOptionsSidebarOpen(!optionsSidebarOpen)}
        />
        
        <MessageList
          messages={messages}
          isMyMessage={isMyMessage}
          formatTime={formatTime}
          messagesEndRef={messagesEndRef}
          error={error}
        />
        
        <MessageInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          onSendMessage={handleSendMessage}
          sending={sending}
        />
      </div>

      {/* Options Sidebar */}
      <OptionsSidebar
        roomId={roomId}
        isOpen={optionsSidebarOpen}
        onClose={() => setOptionsSidebarOpen(false)}
        className={optionsSidebarOpen ? '' : 'hidden lg:block'}
      />
    </div>
  );
}

