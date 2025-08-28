import { useState, useEffect } from 'react';
import { useUserInfo } from './use-user-info';
import { AuthService } from '@/data/auth/auth-service';
import { useSuccessDialog, useErrorDialog } from '@/app/components/providers/dialog-provider';

export function usePersonalInfo() {
  const userInfo = useUserInfo();
  const showSuccess = useSuccessDialog();
  const showError = useErrorDialog();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    displayName: userInfo.displayName,
    email: userInfo.email,
    bio: 'Software developer passionate about creating amazing user experiences.'
  });

  // Update form data when userInfo changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      displayName: userInfo.displayName,
      email: userInfo.email
    }));
  }, [userInfo.displayName, userInfo.email]);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const { error } = await AuthService.updateProfile({
        displayName: formData.displayName,
      });
      if (error) {
        showError({
          title: 'Update Failed',
          message: error.message || 'Failed to update profile. Please try again.'
        });
      } else {
        showSuccess({
          title: 'Profile Updated',
          message: 'Your profile has been successfully updated.'
        });
        setIsEditing(false);
      }
    } catch (error: any) {
      showError({
        title: 'Update Failed',
        message: error.message || 'An unexpected error occurred while updating your profile.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      displayName: userInfo.displayName,
      email: userInfo.email,
      bio: 'Software developer passionate about creating amazing user experiences.'
    });
    setIsEditing(false);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return {
    isEditing,
    isSaving,
    formData,
    setIsEditing,
    handleSave,
    handleCancel,
    updateField
  };
}
