'use client';

import { ChatMessage } from '@/data/controllers/message';

interface MessageListProps {
  messages: ChatMessage[];
  isMyMessage: (message: ChatMessage) => boolean;
  formatTime: (timestamp: string) => string;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  error?: string;
}

export function MessageList({ messages, isMyMessage, formatTime, messagesEndRef, error }: MessageListProps) {
  if (error) {
    return (
      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p>No messages yet. Start the conversation!</p>
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${isMyMessage(message) ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              isMyMessage(message)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
            }`}>
              {!isMyMessage(message) && (
                <p className="text-xs font-medium mb-1 opacity-75">
                  {message.user?.displayName || 'Unknown User'}
                </p>
              )}
              <p className="text-sm">{message.body}</p>
              <p className={`text-xs mt-1 ${
                isMyMessage(message) ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {formatTime(message.created_at)}
                {message.edited_at && ' (edited)'}
              </p>
            </div>
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
