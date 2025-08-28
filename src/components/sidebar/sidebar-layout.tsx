'use client';

import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { useSidebar } from './sidebar-provider';

interface SidebarLayoutProps extends HTMLAttributes<HTMLDivElement> {
  id: string;
  position?: 'left' | 'right';
  overlay?: boolean;
  overlayClassName?: string;
  width?: number;
  zIndex?: number;
  children: ReactNode;
}

const SidebarLayout = forwardRef<HTMLDivElement, SidebarLayoutProps>(
  ({ 
    id,
    position = 'left',
    overlay = true,
    overlayClassName = '',
    width,
    zIndex,
    className = '',
    children,
    ...props 
  }, ref) => {
    const { getSidebarState, closeSidebar } = useSidebar();
    const sidebarState = getSidebarState(id);
    const isOpen = sidebarState?.isOpen || false;
    
    const finalWidth = width || sidebarState?.width || 320;
    const finalZIndex = zIndex || sidebarState?.zIndex || 50;

    const positionClasses = position === 'left' 
      ? 'left-0' 
      : 'right-0';

    const transformClasses = position === 'left'
      ? (isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0')
      : (isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0');

    const sidebarClasses = `
      fixed lg:static inset-y-0 ${positionClasses}
      bg-white dark:bg-gray-900 
      border-r border-gray-200 dark:border-gray-800
      transform transition-transform duration-200 ease-out
      ${transformClasses}
      ${className}
    `;

    const overlayClasses = `
      fixed inset-0 bg-black bg-opacity-50 lg:hidden
      ${overlayClassName}
    `;

    return (
      <>
        {/* Mobile Overlay */}
        {overlay && isOpen && (
          <div 
            className={overlayClasses}
            style={{ zIndex: finalZIndex - 1 }}
            onClick={() => closeSidebar(id)}
          />
        )}
        
        {/* Sidebar */}
        <div 
          ref={ref}
          className={sidebarClasses}
          style={{ 
            width: `${finalWidth}px`,
            zIndex: finalZIndex
          }}
          {...props}
        >
          {children}
        </div>
      </>
    );
  }
);

SidebarLayout.displayName = 'SidebarLayout';

export { SidebarLayout };
