'use client';

import { forwardRef, HTMLAttributes } from 'react';

interface SidebarSectionProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  isCollapsed?: boolean;
}

const SidebarSection = forwardRef<HTMLDivElement, SidebarSectionProps>(
  ({ className = '', title, isCollapsed = false, children, ...props }, ref) => {
    const classes = `space-y-1 ${className}`;

    return (
      <div ref={ref} className={classes} {...props}>
        {title && !isCollapsed && (
          <div className="px-3 py-2 mt-3">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {title}
            </h3>
          </div>
        )}
        <div className="space-y-1">
          {children}
        </div>
      </div>
    );
  }
);

SidebarSection.displayName = 'SidebarSection';

export { SidebarSection };
