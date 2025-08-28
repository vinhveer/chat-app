'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { SidebarHeader } from './sidebar-header';
import { SidebarContent } from './sidebar-content';
import { useRooms } from '@/hooks/use-rooms';

interface NavigationSidebarModularProps extends HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
  onClose?: () => void;
}

const NavigationSidebarModular = forwardRef<HTMLDivElement, NavigationSidebarModularProps>(
  ({ className = '', isOpen = true, onClose, ...props }, ref) => {
    const { rooms, loading } = useRooms();

    return (
      <>
        {/* Mobile Overlay */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
        
        {/* Sidebar */}
        <div 
          ref={ref}
          className={`
            fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
            w-full lg:w-80 
            bg-white dark:bg-gray-900 
            border-r border-gray-200 dark:border-gray-800
            transform transition-transform duration-200 ease-out
            ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            ${className}
          `}
          {...props}
        >
          <div className="flex flex-col" style={{ height: '100dvh' }}>
            <SidebarHeader />
            <SidebarContent rooms={rooms} loading={loading} onClose={onClose} />
          </div>
        </div>
      </>
    );
  }
);

NavigationSidebarModular.displayName = 'NavigationSidebarModular';

export { NavigationSidebarModular };
