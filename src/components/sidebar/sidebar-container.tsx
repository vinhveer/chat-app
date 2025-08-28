'use client';

import { forwardRef, HTMLAttributes, ReactNode } from 'react';

interface SidebarContainerProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode;
  content?: ReactNode;
  footer?: ReactNode;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
}

const SidebarContainer = forwardRef<HTMLDivElement, SidebarContainerProps>(
  ({ 
    header,
    content,
    footer,
    headerClassName = '',
    contentClassName = '',
    footerClassName = '',
    className = '',
    children,
    ...props 
  }, ref) => {
    const containerClasses = `flex flex-col ${className}`;
    const defaultHeaderClasses = `flex-shrink-0 ${headerClassName}`;
    const defaultContentClasses = `flex-1 overflow-y-auto ${contentClassName}`;
    const defaultFooterClasses = `flex-shrink-0 ${footerClassName}`;

    return (
      <div 
        ref={ref} 
        className={containerClasses}
        style={{ height: '100dvh' }}
        {...props}
      >
        {/* Header Slot */}
        {header && (
          <div className={defaultHeaderClasses}>
            {header}
          </div>
        )}

        {/* Content Slot */}
        {(content || children) && (
          <div className={defaultContentClasses}>
            {content || children}
          </div>
        )}

        {/* Footer Slot */}
        {footer && (
          <div className={defaultFooterClasses}>
            {footer}
          </div>
        )}
      </div>
    );
  }
);

SidebarContainer.displayName = 'SidebarContainer';

export { SidebarContainer };
