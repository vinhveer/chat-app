'use client';

import { PageWrapper, FormField } from '../components';
import { usePasswordReset } from '../hooks';

export default function ResetPasswordPage() {
  const { 
    step, 
    isSubmitting, 
    formData, 
    errors, 
    handleSubmit, 
    handleInputChange, 
    handleBackToAccount 
  } = usePasswordReset();

  if (step === 'success') {
    return (
      <PageWrapper title="Password Updated">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Password Updated!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Your password has been successfully changed.
          </p>
          <button
            onClick={handleBackToAccount}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Back to Account
          </button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper 
      title="Reset Password" 
      subtitle="Update your password to keep your account secure"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Current Password"
          type="password"
          value={formData.currentPassword}
          placeholder="Enter your current password"
          error={errors.currentPassword}
          onChange={(value) => handleInputChange('currentPassword', value)}
        />

        <FormField
          label="New Password"
          type="password"
          value={formData.newPassword}
          placeholder="Enter your new password"
          error={errors.newPassword}
          onChange={(value) => handleInputChange('newPassword', value)}
        />

        <FormField
          label="Confirm New Password"
          type="password"
          value={formData.confirmPassword}
          placeholder="Confirm your new password"
          error={errors.confirmPassword}
          onChange={(value) => handleInputChange('confirmPassword', value)}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-6 rounded-lg transition-colors flex items-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Updating Password...</span>
            </>
          ) : (
            <span>Update Password</span>
          )}
        </button>
      </form>
    </PageWrapper>
  );
}
