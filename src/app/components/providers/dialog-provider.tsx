'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { NotificationDialog, NotificationType } from '../ui/notification-dialog';
import { ConfirmationDialog } from '../ui/confirmation-dialog';
import { ActionDialog, ActionDialogState } from '../ui/action-dialog';

interface DialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  showCancel?: boolean;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger' | 'warning';
  onConfirm: () => void;
  onCancel?: () => void;
}

interface ActionDialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
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

interface DialogContextType {
  showSuccess: (options: DialogOptions) => void;
  showError: (options: DialogOptions) => void;
  showWarning: (options: DialogOptions) => void;
  showInfo: (options: DialogOptions) => void;
  showNotification: (type: NotificationType, options: DialogOptions) => void;
  showConfirmation: (options: ConfirmationOptions) => void;
  showActionDialog: (options: ActionDialogOptions) => void;
  closeDialog: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

interface DialogState {
  isOpen: boolean;
  type: NotificationType;
  options: DialogOptions;
}

interface ConfirmationState {
  isOpen: boolean;
  options: ConfirmationOptions;
}

interface ActionDialogStateType {
  isOpen: boolean;
  state: ActionDialogState;
  options: ActionDialogOptions;
}

export function DialogProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<DialogState>({
    isOpen: false,
    type: 'info',
    options: { title: '', message: '' }
  });

  const [confirmation, setConfirmation] = useState<ConfirmationState>({
    isOpen: false,
    options: { title: '', message: '', onConfirm: () => {} }
  });

  const [actionDialog, setActionDialog] = useState<ActionDialogStateType>({
    isOpen: false,
    state: 'idle',
    options: { title: '', message: '', onConfirm: () => {} }
  });

  const showNotification = (type: NotificationType, options: DialogOptions) => {
    setDialog({
      isOpen: true,
      type,
      options
    });
  };

  const showSuccess = (options: DialogOptions) => {
    showNotification('success', options);
  };

  const showError = (options: DialogOptions) => {
    showNotification('error', options);
  };

  const showWarning = (options: DialogOptions) => {
    showNotification('warning', options);
  };

  const showInfo = (options: DialogOptions) => {
    showNotification('info', options);
  };

  const showConfirmation = (options: ConfirmationOptions) => {
    setConfirmation({
      isOpen: true,
      options
    });
  };

  const showActionDialog = (options: ActionDialogOptions) => {
    setActionDialog({
      isOpen: true,
      state: 'idle',
      options: {
        ...options,
        onConfirm: async () => {
          try {
            setActionDialog(prev => ({ ...prev, state: 'loading' }));
            await options.onConfirm();
            setActionDialog(prev => ({ ...prev, state: 'success' }));
            setTimeout(() => {
              setActionDialog(prev => ({ ...prev, isOpen: false, state: 'idle' }));
            }, 2000);
          } catch (error) {
            setActionDialog(prev => ({ ...prev, state: 'error' }));
          }
        }
      }
    });
  };

  const closeDialog = () => {
    setDialog(prev => ({ ...prev, isOpen: false }));
  };

  const closeConfirmation = () => {
    setConfirmation(prev => ({ ...prev, isOpen: false }));
  };

  const closeActionDialog = () => {
    setActionDialog(prev => ({ ...prev, isOpen: false, state: 'idle' }));
  };

  return (
    <DialogContext.Provider
      value={{
        showSuccess,
        showError,
        showWarning,
        showInfo,
        showNotification,
        showConfirmation,
        showActionDialog,
        closeDialog
      }}
    >
      {children}
      
      <NotificationDialog
        isOpen={dialog.isOpen}
        onClose={closeDialog}
        type={dialog.type}
        title={dialog.options.title}
        message={dialog.options.message}
        confirmText={dialog.options.confirmText}
        showCancel={dialog.options.showCancel}
        cancelText={dialog.options.cancelText}
        onConfirm={dialog.options.onConfirm}
        onCancel={dialog.options.onCancel}
      />

      <ConfirmationDialog
        isOpen={confirmation.isOpen}
        onClose={closeConfirmation}
        title={confirmation.options.title}
        message={confirmation.options.message}
        confirmText={confirmation.options.confirmText}
        cancelText={confirmation.options.cancelText}
        variant={confirmation.options.variant}
        onConfirm={confirmation.options.onConfirm}
        onCancel={confirmation.options.onCancel}
      />

      <ActionDialog
        isOpen={actionDialog.isOpen}
        onClose={closeActionDialog}
        title={actionDialog.options.title}
        message={actionDialog.options.message}
        confirmText={actionDialog.options.confirmText}
        cancelText={actionDialog.options.cancelText}
        state={actionDialog.state}
        onConfirm={actionDialog.options.onConfirm}
        onCancel={actionDialog.options.onCancel}
        successMessage={actionDialog.options.successMessage}
        errorMessage={actionDialog.options.errorMessage}
        loadingMessage={actionDialog.options.loadingMessage}
        icon={actionDialog.options.icon}
        successIcon={actionDialog.options.successIcon}
        errorIcon={actionDialog.options.errorIcon}
        loadingIcon={actionDialog.options.loadingIcon}
      />
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
}

// Convenience hooks for specific notification types
export function useSuccessDialog() {
  const { showSuccess } = useDialog();
  return showSuccess;
}

export function useErrorDialog() {
  const { showError } = useDialog();
  return showError;
}

export function useWarningDialog() {
  const { showWarning } = useDialog();
  return showWarning;
}

export function useInfoDialog() {
  const { showInfo } = useDialog();
  return showInfo;
}

export function useConfirmationDialog() {
  const { showConfirmation } = useDialog();
  return showConfirmation;
}

export function useActionDialog() {
  const { showActionDialog } = useDialog();
  return showActionDialog;
}
