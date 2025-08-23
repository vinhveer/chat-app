interface FormFieldProps {
  label: string;
  value: string;
  type?: 'text' | 'email' | 'password' | 'textarea';
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  badge?: string;
  hint?: string;
  rows?: number;
  onChange?: (value: string) => void;
}

export function FormField({ 
  label, 
  value, 
  type = 'text', 
  placeholder, 
  disabled = false,
  error,
  badge,
  hint,
  rows = 3,
  onChange 
}: FormFieldProps) {
  const isEditable = !disabled && onChange;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      
      {isEditable ? (
        type === 'textarea' ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none ${
              error 
                ? 'border-red-300 dark:border-red-600' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder={placeholder}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
              error 
                ? 'border-red-300 dark:border-red-600' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder={placeholder}
          />
        )
      ) : (
        <div className="flex items-center space-x-2">
          <p className="text-gray-900 dark:text-white py-2 flex-1">
            {value}
          </p>
          {badge && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              {badge}
            </span>
          )}
        </div>
      )}
      
      {error && (
        <p className="text-red-600 dark:text-red-400 text-sm mt-1">
          {error}
        </p>
      )}
      
      {hint && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {hint}
        </p>
      )}
    </div>
  );
}
