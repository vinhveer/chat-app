export function SearchSkeleton() {
  return (
    <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
  );
}

export function SidebarItemSkeleton() {
  return (
    <div className="flex items-center space-x-3 px-3 py-2 rounded-lg">
      {/* Icon skeleton */}
      <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded animate-pulse flex-shrink-0"></div>
      
      {/* Text skeleton */}
      <div className="flex-1 space-y-1">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-3/4"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
      </div>
    </div>
  );
}

export function RoomListSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <SidebarItemSkeleton key={index} />
      ))}
    </>
  );
}
