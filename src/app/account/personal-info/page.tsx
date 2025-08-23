'use client';

import { PageWrapper, FormField } from '../components';
import { usePersonalInfo } from '../hooks';

export default function PersonalInfoPage() {
  const { 
    isSaving, 
    formData, 
    handleSave, 
    updateField 
  } = usePersonalInfo();

  return (
    <PageWrapper 
      title="Personal Information"
    >
      <div className="space-y-6">
        <FormField
          label="Display Name"
          value={formData.displayName}
          onChange={(value) => updateField('displayName', value)}
        />

        <FormField
          label="Email Address"
          value={formData.email}
          disabled={true}
          badge="Verified"
          hint="Contact support to change your email address"
        />

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
    </PageWrapper>
  );
}
