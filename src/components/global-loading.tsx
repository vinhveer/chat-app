"use client";

interface GlobalLoadingProps {
  children: React.ReactNode;
}

export function GlobalLoading({ children }: GlobalLoadingProps) {
  return (
    <div className="flex-1 relative w-full h-full">
      {children}
    </div>
  );
}
