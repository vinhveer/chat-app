'use client';

import { useAuth } from '@/data/auth';
import { useRouter } from 'next/navigation';
import { ChatHeader } from './components';

export default function ChatPage() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="flex flex-col" style={{ height: '100dvh' }}>
      <ChatHeader 
        title="Chat App"
        subtitle={`Welcome back, ${user?.user_metadata?.displayName || user?.email?.split('@')[0] || 'User'}`}
      />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-6 max-w-md mx-auto px-6">
          <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-12 h-12 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome to Chat App
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Start chatting with your friends and colleagues. Create or join chat rooms to begin conversations.
            </p>
          </div>

          <div className="space-y-3">
            <button 
              onClick={() => router.push('/chat/create')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Create New Chat Room
            </button>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Chat features coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
