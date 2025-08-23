'use client';

import { PageWrapper, UserAvatar, FormField } from '../components';
import { usePersonalInfo } from '../hooks';

export default function PersonalInfoPage() {
  const { 
    isEditing, 
    isSaving, 
    formData, 
    setIsEditing, 
    handleSave, 
    handleCancel, 
    updateField 
  } = usePersonalInfo();

  return (
    <PageWrapper 
      title="Personal Information"
    >
      {/* Edit Button */}
      {!isEditing && (
        <div className="mb-6">
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Edit</span>
          </button>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Profile Picture */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <UserAvatar 
              name={formData.displayName} 
              size="lg"
              editable={isEditing}
            />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Profile Picture
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {isEditing ? 'Click the camera icon to update your photo' : 'Your profile picture appears across the platform'}
              </p>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="p-6 space-y-6">
          <FormField
            label="Display Name"
            value={formData.displayName}
            onChange={isEditing ? (value) => updateField('displayName', value) : undefined}
          />

          <FormField
            label="Email Address"
            value={formData.email}
            disabled={true}
            badge="Verified"
            hint="Contact support to change your email address"
          />

          <FormField
            label="Bio"
            value={formData.bio}
            type="textarea"
            placeholder="Tell us about yourself..."
            onChange={isEditing ? (value) => updateField('bio', value) : undefined}
          />
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
