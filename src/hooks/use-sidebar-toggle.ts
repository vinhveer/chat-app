'use client';

import { create } from 'zustand';

interface SidebarStore {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

export const useSidebarToggle = create<SidebarStore>((set) => ({
  isOpen: true,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false })
}));

// Global function for backward compatibility
if (typeof window !== 'undefined') {
  (window as any).toggleSidebar = () => {
    useSidebarToggle.getState().toggle();
  };
}
