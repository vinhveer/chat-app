import { useState } from 'react';
import { useUserInfo } from './use-user-info';

export function usePersonalInfo() {
  const userInfo = useUserInfo();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    displayName: userInfo.displayName,
    email: userInfo.email,
    bio: 'Software developer passionate about creating amazing user experiences.'
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setIsEditing(false);
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
