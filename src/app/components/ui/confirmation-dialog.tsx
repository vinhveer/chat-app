'use client';

import { Dialog } from './dialog';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger' | 'warning';
  onConfirm: () => void;
  onCancel?: () => void;
}

const variantConfig = {
  default: {
    icon: (
      <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    confirmButton: 'bg-blue-600 hover:bg-blue-700'
  },
  danger: {
    icon: (
      <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
    bgColor: 'bg-red-100 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800',
    confirmButton: 'bg-red-600 hover:bg-red-700'
  },
  warning: {
    icon: (
      <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    confirmButton: 'bg-yellow-600 hover:bg-yellow-700'
  }
};

export function ConfirmationDialog({
  isOpen,
  onClose,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel
}: ConfirmationDialogProps) {
  const config = variantConfig[variant];

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center space-y-4">
        {/* Icon */}
        <div className={`mx-auto w-12 h-12 rounded-full ${config.bgColor} ${config.borderColor} border flex items-center justify-center`}>
          {config.icon}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-3 justify-center pt-2">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 text-white rounded-lg transition-colors ${config.confirmButton}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Dialog>
  );
}
