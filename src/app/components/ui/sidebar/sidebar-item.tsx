'use client';

import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface SidebarItemProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  href?: string;
  isActive?: boolean;
  isCollapsed?: boolean;
  subtitle?: string;
}

const SidebarItem = forwardRef<HTMLDivElement, SidebarItemProps>(
  ({ className = '', icon, href, isActive = false, isCollapsed = false, subtitle, children, onClick, ...props }, ref) => {
    const router = useRouter();

    const baseClasses = isCollapsed 
      ? 'flex items-center justify-center px-3 py-2 rounded-lg transition-colors cursor-pointer relative'
      : 'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer relative';
    const activeClasses = isActive 
      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' 
      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800';
    const classes = `${baseClasses} ${activeClasses} ${className}`;

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (href) {
        router.push(href);
      }
      onClick?.(e);
    };

    return (
      <div ref={ref} className={classes} onClick={handleClick} {...props}>
        {icon && (
          <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
            {icon}
          </div>
        )}
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">
              {children}
            </div>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {subtitle}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

SidebarItem.displayName = 'SidebarItem';

export { SidebarItem };
