'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { OptionsHeader } from './options-header';
import { OptionsContent } from './options-content';

interface OptionsSidebarProps extends HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
  onClose?: () => void;
  roomId: string;
}

const OptionsSidebar = forwardRef<HTMLDivElement, OptionsSidebarProps>(
  ({ className = '', isOpen = false, onClose, roomId, ...props }, ref) => {
    return (
      <>
        {/* Mobile Overlay */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
        
        {/* Options Sidebar */}
        <div 
          ref={ref}
          className={`
            fixed lg:static inset-y-0 right-0 z-50 lg:z-auto
            w-full lg:w-80 
            bg-white dark:bg-gray-900 
            border-l border-gray-200 dark:border-gray-800
            transform transition-transform duration-200 ease-out
            ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
            ${className}
          `}
          {...props}
        >
          <div className="flex flex-col" style={{ height: '100dvh' }}>
            <OptionsHeader onClose={onClose} />
            <OptionsContent roomId={roomId} onClose={onClose} />
          </div>
        </div>
      </>
    );
  }
);

OptionsSidebar.displayName = 'OptionsSidebar';

export { OptionsSidebar };
