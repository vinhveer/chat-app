'use client';

import { Dialog } from './dialog';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: NotificationType;
  title: string;
  message: string;
  confirmText?: string;
  showCancel?: boolean;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const notificationConfig = {
  success: {
    icon: (
      <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    bgColor: 'bg-green-100 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800',
    buttonColor: 'bg-green-600 hover:bg-green-700'
  },
  error: {
    icon: (
      <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    bgColor: 'bg-red-100 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800',
    buttonColor: 'bg-red-600 hover:bg-red-700'
  },
  warning: {
    icon: (
      <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    buttonColor: 'bg-yellow-600 hover:bg-yellow-700'
  },
  info: {
    icon: (
      <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
    buttonColor: 'bg-blue-600 hover:bg-blue-700'
  }
};

export function NotificationDialog({
  isOpen,
  onClose,
  type,
  title,
  message,
  confirmText = 'OK',
  showCancel = false,
  cancelText = 'Cancel',
  onConfirm,
  onCancel
}: NotificationDialogProps) {
  const config = notificationConfig[type];

  const handleConfirm = () => {
    onConfirm?.();
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
          {showCancel && (
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 text-white rounded-lg transition-colors ${config.buttonColor}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Dialog>
  );
}

// Convenience components for specific notification types
export function SuccessDialog(props: Omit<NotificationDialogProps, 'type'>) {
  return <NotificationDialog {...props} type="success" />;
}

export function ErrorDialog(props: Omit<NotificationDialogProps, 'type'>) {
  return <NotificationDialog {...props} type="error" />;
}

export function WarningDialog(props: Omit<NotificationDialogProps, 'type'>) {
  return <NotificationDialog {...props} type="warning" />;
}

export function InfoDialog(props: Omit<NotificationDialogProps, 'type'>) {
  return <NotificationDialog {...props} type="info" />;
}
