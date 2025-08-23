import { useRouter } from 'next/navigation';

interface MenuItemProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

export function MenuItem({ title, description, href, icon }: MenuItemProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(href)}
      className="w-full p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group text-left rounded-md"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {icon}
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          </div>
        </div>
        <svg 
          className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}
