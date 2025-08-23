'use client';

import { PageWrapper, UserAvatar } from '../components';
import { useLogout, useUserInfo } from '../hooks';

export default function LogoutPage() {
  const userInfo = useUserInfo();
  const { step, handleLogout, handleCancel } = useLogout();

  if (step === 'logging-out') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-start p-6 lg:p-12" style={{ minHeight: '100dvh' }}>
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
            <div className="space-y-4">
              <div className="w-16 h-16 flex items-center justify-center">
                <div className="w-8 h-8 border-3 border-gray-400 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Signing Out...
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Please wait while we securely sign you out.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-start p-6 lg:p-12" style={{ minHeight: '100dvh' }}>
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
            <div className="space-y-4">
              <div className="w-16 h-16 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Signed Out Successfully
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Redirecting to home page...
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageWrapper 
      title="Sign Out" 
      subtitle="Are you sure you want to sign out?"
    >
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <UserAvatar name={userInfo.displayName} size="sm" />
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {userInfo.displayName}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {userInfo.email}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}
