interface AuthButtonProps {
  type?: 'button' | 'submit';
  disabled?: boolean;
  loading?: boolean;
  loadingText: string;
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export function AuthButton({
  type = 'button',
  disabled = false,
  loading = false,
  loadingText,
  children,
  onClick,
  variant = 'primary'
}: AuthButtonProps) {
  const baseClasses = "w-full font-medium py-2 px-4 rounded-lg transition-colors duration-200";
  const primaryClasses = "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white";
  const secondaryClasses = "bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white";

  const classes = `${baseClasses} ${variant === 'primary' ? primaryClasses : secondaryClasses}`;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={classes}
    >
      {loading ? loadingText : children}
    </button>
  );
}
