'use client';

import { forwardRef, HTMLAttributes } from 'react';

interface SidebarProps extends HTMLAttributes<HTMLDivElement> {
  isCollapsed?: boolean;
  width?: number;
}

const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  ({ className = '', isCollapsed = false, width, children, ...props }, ref) => {
    const baseClasses = 'flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300';
    
    const sidebarStyle = width ? { width: `${width}px` } : {};
    const widthClasses = width ? '' : (isCollapsed ? 'w-20' : 'w-64');
    const classes = `${baseClasses} ${widthClasses} ${className}`;

    return (
      <div ref={ref} className={classes} style={sidebarStyle} {...props}>
        {children}
      </div>
    );
  }
);

Sidebar.displayName = 'Sidebar';

export { Sidebar };
