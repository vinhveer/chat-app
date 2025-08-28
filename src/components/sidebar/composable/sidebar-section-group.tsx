'use client';

import { forwardRef, HTMLAttributes, ReactNode } from 'react';

interface SidebarSectionGroupProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  spacing?: 'none' | 'sm' | 'md' | 'lg';
}

const SidebarSectionGroup = forwardRef<HTMLDivElement, SidebarSectionGroupProps>(
  ({ className = '', spacing = 'md', children, ...props }, ref) => {
    const spacingClasses = {
      none: 'space-y-0',
      sm: 'space-y-2',
      md: 'space-y-4',
      lg: 'space-y-6'
    };

    const classes = `${spacingClasses[spacing]} ${className}`;

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

SidebarSectionGroup.displayName = 'SidebarSectionGroup';

export { SidebarSectionGroup };
