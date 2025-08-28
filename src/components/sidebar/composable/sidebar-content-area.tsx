'use client';

import { forwardRef, HTMLAttributes, ReactNode } from 'react';

interface SidebarContentAreaProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const SidebarContentArea = forwardRef<HTMLDivElement, SidebarContentAreaProps>(
  ({ className = '', padding = 'md', children, ...props }, ref) => {
    const paddingClasses = {
      none: '',
      sm: 'p-1',
      md: 'p-2', 
      lg: 'p-4'
    };

    const classes = `flex-1 overflow-y-auto ${paddingClasses[padding]} ${className}`;

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

SidebarContentArea.displayName = 'SidebarContentArea';

export { SidebarContentArea };
