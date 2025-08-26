'use client';

import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProgressivePrefetch } from '@/hooks/use-progressive-prefetch';

interface SidebarItemProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  href?: string;
  isActive?: boolean;
  isCollapsed?: boolean;
  subtitle?: string;
  keepSidebarOpen?: boolean; // New prop to control sidebar behavior
}

const SidebarItem = forwardRef<HTMLDivElement, SidebarItemProps>(
  ({ className = '', icon, href, isActive = false, subtitle, children, onClick, keepSidebarOpen = false, ...props }, ref) => {
    const router = useRouter();
    const { prefetchOnHover } = useProgressivePrefetch();

    const baseClasses = 'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer relative';
    const activeClasses = isActive 
      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' 
      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800';
    const classes = `${baseClasses} ${activeClasses} ${className}`;

    const handleClick = (e: React.MouseEvent) => {
      // Only call onClick if sidebar should not be kept open
      if (!keepSidebarOpen) {
        onClick?.(e as React.MouseEvent<HTMLDivElement>);
      }
    };

    const handleMouseEnter = () => {
      // Trigger Level 2 prefetching on hover
      if (href) {
        prefetchOnHover(href);
      }
    };

    const content = (
      <>
        {icon && (
          <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
            {icon}
          </div>
        )}
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
      </>
    );

    if (href) {
      return (
        <Link 
          href={href} 
          prefetch={false} 
          className={classes} 
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
        >
          {content}
        </Link>
      );
    }

    return (
      <div ref={ref} className={classes} onClick={handleClick} {...props}>
        {content}
      </div>
    );
  }
);

SidebarItem.displayName = 'SidebarItem';

export { SidebarItem };
