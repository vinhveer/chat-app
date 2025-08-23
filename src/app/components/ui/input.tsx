'use client';

import { InputHTMLAttributes, forwardRef, useId } from 'react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'float' | 'bordered';
  size?: 'sm' | 'md' | 'lg';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, helperText, id, variant = 'default', size = 'md', ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    
    const sizeClasses = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-11 px-4 text-sm',
      lg: 'h-12 px-4 text-base'
    };
    
    const borderedSizeClasses = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-11 px-4 text-sm font-medium',
      lg: 'h-12 px-4 text-base'
    };
    
    // Google-style input base classes
    const baseClasses = `w-full bg-transparent transition-all duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-50 outline-none ${sizeClasses[size]}`;
    
    if (variant === 'float') {
      const borderClasses = error
        ? 'border-red-500 focus:border-red-500'
        : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400';
        
      const floatClasses = `${baseClasses} ${borderClasses} border-0 border-b-2 rounded-none text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400`;
      
      return (
        <div className="relative w-full group">
          <input
            ref={ref}
            id={inputId}
            className={`${floatClasses} placeholder-transparent peer bg-transparent`}
            placeholder={label || props.placeholder}
            {...props}
          />
          {label && (
            <label 
              htmlFor={inputId} 
              className={`absolute left-0 transition-all duration-200 ease-out pointer-events-none
                ${error 
                  ? 'text-red-500' 
                  : 'text-gray-500 dark:text-gray-400 peer-focus:text-blue-500 dark:peer-focus:text-blue-400'
                }
                peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base
                peer-focus:-top-1 peer-focus:text-xs peer-focus:-translate-y-0
                ${props.value || props.defaultValue ? '-top-1 text-xs -translate-y-0' : 'top-1/2 -translate-y-1/2 text-base'}
              `}
            >
              {label}
            </label>
          )}
          {/* Focus underline */}
          <div className={`absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 transition-all duration-200 ease-out
            ${error ? 'bg-red-500' : 'bg-blue-500 dark:bg-blue-400'}
            peer-focus:scale-x-100
          `} />
          {error && (
            <p className="mt-2 text-xs text-red-500 dark:text-red-400">
              {error}
            </p>
          )}
          {helperText && !error && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {helperText}
            </p>
          )}
        </div>
      );
    }
    
    if (variant === 'bordered') {
      const borderedClasses = error
        ? 'border-2 border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
        : 'border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10';
        
      const fullBorderedClasses = `w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 transition-all duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-50 outline-none rounded-lg ${borderedClasses} ${borderedSizeClasses[size]}`;
      
      return (
        <div className="w-full">
          {label && (
            <label 
              htmlFor={inputId} 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              {label}
            </label>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`${fullBorderedClasses} ${className}`}
            {...props}
          />
          {error && (
            <p className="mt-2 text-xs text-red-500 dark:text-red-400">
              {error}
            </p>
          )}
          {helperText && !error && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {helperText}
            </p>
          )}
        </div>
      );
    }
    
    const defaultBorderClasses = error
      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
      : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10';
      
    const defaultClasses = `${baseClasses} ${defaultBorderClasses} border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4`;
    
    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId} 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`${defaultClasses} ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-2 text-xs text-red-500 dark:text-red-400">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
