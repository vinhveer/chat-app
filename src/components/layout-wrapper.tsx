"use client";

import { useAuth } from "@/data/auth";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { NavigationSidebarModular as NavigationSidebar } from "./sidebar/navigation-sidebar-modular";
import { GlobalLoading } from "./global-loading";
import { PageTransitionProvider } from "./providers/page-transition-provider";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { user, loading } = useAuth();
  const { isOpen: isSidebarOpen, close: closeSidebar } = useSidebarToggle();

  if (loading) {
    return (
      <div className="min-h-screen-stable flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    // Authenticated layout with sidebar and global loading in content area only
    return (
      <div className="flex h-screen-stable bg-gray-50 dark:bg-gray-900">
        <NavigationSidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
        />
        <PageTransitionProvider>
          <GlobalLoading>
            {children}
          </GlobalLoading>
        </PageTransitionProvider>
      </div>
    );
  }

  // Non-authenticated layout without sidebar but with global loading
  return (
    <PageTransitionProvider>
      <GlobalLoading>
        {children}
      </GlobalLoading>
    </PageTransitionProvider>
  );
}
