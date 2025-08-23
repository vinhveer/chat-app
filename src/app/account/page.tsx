'use client';

import { PageWrapper, MenuItem } from './components';
import { useUserInfo } from './hooks';

export default function AccountPage() {
  const userInfo = useUserInfo();

  const menuItems = [
    {
      title: 'Personal Info',
      description: 'Update your name, email and other details',
      href: '/account/personal-info',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      title: 'Reset Password',
      description: 'Change your password for security',
      href: '/account/reset-password',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      )
    },
    {
      title: 'Logout',
      description: 'Sign out of your account',
      href: '/account/logout',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      )
    }
  ];

  return (
    <PageWrapper title="Account">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {userInfo.displayName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              {userInfo.displayName}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {userInfo.email}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <MenuItem
              key={index}
              title={item.title}
              description={item.description}
              href={item.href}
              icon={item.icon}
            />
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
