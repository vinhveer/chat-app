'use client';

import { Dialog } from './dialog';

export type ActionDialogState = 'idle' | 'loading' | 'success' | 'error';

interface ActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  state: ActionDialogState;
  onConfirm: () => Promise<void> | void;
  onCancel?: () => void;
  successMessage?: string;
  errorMessage?: string;
  loadingMessage?: string;
  icon?: React.ReactNode;
  successIcon?: React.ReactNode;
  errorIcon?: React.ReactNode;
  loadingIcon?: React.ReactNode;
}

export function ActionDialog({
  isOpen,
  onClose,
  title,
  message,
  confirmText = 'OK',
  cancelText = 'Cancel',
  state,
  onConfirm,
  onCancel,
  successMessage = 'Operation completed successfully',
  errorMessage = 'Operation failed. Please try again.',
  loadingMessage = 'Please wait while we process your request.',
  icon,
  successIcon,
  errorIcon,
  loadingIcon
}: ActionDialogProps) {
  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      // Error handling is managed by the parent component
      console.error('Action dialog error:', error);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  const handleClose = () => {
    if (state === 'loading') return; // Prevent closing during loading
    onClose();
  };

  const renderContent = () => {
    switch (state) {
      case 'loading':
        return (
          <div className="text-center space-y-3">
            <div className="mx-auto w-12 h-12 flex items-center justify-center">
              {loadingIcon || (
                <div className="w-8 h-8 border-3 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Processing...
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {loadingMessage}
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-3">
            <div className="mx-auto w-12 h-12 flex items-center justify-center">
              {successIcon || (
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Success!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {successMessage}
            </p>
            <div className="pt-1">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center space-y-3">
            <div className="mx-auto w-12 h-12 flex items-center justify-center">
              {errorIcon || (
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Error
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {errorMessage}
            </p>
            <div className="pt-1">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        );

      default: // idle state
        return (
          <div className="text-center space-y-3">
            <div className="mx-auto w-12 h-12 flex items-center justify-center">
              {icon || (
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {message}
            </p>
            <div className="flex gap-3 justify-center pt-1">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {confirmText}
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} size="sm">
      {renderContent()}
    </Dialog>
  );
}
