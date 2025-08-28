'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface SidebarState {
  [key: string]: {
    isOpen: boolean;
    width?: number;
    zIndex?: number;
  };
}

interface SidebarContextType {
  sidebars: SidebarState;
  openSidebar: (id: string, options?: { width?: number; zIndex?: number }) => void;
  closeSidebar: (id: string) => void;
  toggleSidebar: (id: string, options?: { width?: number; zIndex?: number }) => void;
  isSidebarOpen: (id: string) => boolean;
  getSidebarState: (id: string) => SidebarState[string] | undefined;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

interface SidebarProviderProps {
  children: ReactNode;
  defaultSidebars?: SidebarState;
}

export function SidebarProvider({ children, defaultSidebars = {} }: SidebarProviderProps) {
  const [sidebars, setSidebars] = useState<SidebarState>(defaultSidebars);

  const openSidebar = (id: string, options?: { width?: number; zIndex?: number }) => {
    setSidebars(prev => ({
      ...prev,
      [id]: {
        isOpen: true,
        width: options?.width,
        zIndex: options?.zIndex
      }
    }));
  };

  const closeSidebar = (id: string) => {
    setSidebars(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        isOpen: false
      }
    }));
  };

  const toggleSidebar = (id: string, options?: { width?: number; zIndex?: number }) => {
    setSidebars(prev => {
      const current = prev[id];
      return {
        ...prev,
        [id]: {
          isOpen: !current?.isOpen,
          width: options?.width || current?.width,
          zIndex: options?.zIndex || current?.zIndex
        }
      };
    });
  };

  const isSidebarOpen = (id: string) => {
    return sidebars[id]?.isOpen || false;
  };

  const getSidebarState = (id: string) => {
    return sidebars[id];
  };

  return (
    <SidebarContext.Provider value={{
      sidebars,
      openSidebar,
      closeSidebar,
      toggleSidebar,
      isSidebarOpen,
      getSidebarState
    }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
