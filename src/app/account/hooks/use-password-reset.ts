import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/data/auth/auth-service';
import { useAuth } from '@/data/auth';
import { useSuccessDialog, useErrorDialog } from '@/app/components/providers/dialog-provider';

type ResetStep = 'form' | 'success';

interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  [key: string]: string;
}

export function usePasswordReset() {
  const router = useRouter();
  const { user } = useAuth();
  const showSuccess = useSuccessDialog();
  const showError = useErrorDialog();
  const [step, setStep] = useState<ResetStep>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!user?.email) {
      setErrors({ currentPassword: 'User email not found' });
      return;
    }

    setIsSubmitting(true);
    try {
      // First verify current password by attempting to sign in
      const { error: signInError } = await AuthService.signIn({
        email: user.email,
        password: formData.currentPassword
      });

      if (signInError) {
        setErrors({ currentPassword: 'Current password is incorrect' });
        setIsSubmitting(false);
        return;
      }

      // If current password is correct, update to new password
      const { error: updateError } = await AuthService.updatePassword(formData.newPassword);
      if (updateError) {
        showError({
          title: 'Password Update Failed',
          message: updateError.message || 'Failed to update password. Please try again.'
        });
      } else {
        showSuccess({
          title: 'Password Updated Successfully',
          message: 'Your password has been successfully changed.',
          onConfirm: () => router.push('/account')
        });
      }
    } catch (error: any) {
      showError({
        title: 'Password Update Failed',
        message: error.message || 'An unexpected error occurred while updating your password.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBackToAccount = () => {
    router.push('/account');
  };

  return {
    step,
    isSubmitting,
    formData,
    errors,
    handleSubmit,
    handleInputChange,
    handleBackToAccount
  };
}
