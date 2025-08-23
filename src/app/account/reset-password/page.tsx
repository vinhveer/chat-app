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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Password Updated!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your password has been successfully changed.
            </p>
            <button
              onClick={handleBackToAccount}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Back to Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageWrapper 
      title="Reset Password" 
      subtitle="Update your password to keep your account secure"
    >
      <div className="max-w-2xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          {/* Security Notice */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                  Password Security Tips
                </h3>
                <ul className="text-sm text-blue-700 dark:text-blue-400 mt-1 space-y-1">
                  <li>• Use at least 8 characters</li>
                  <li>• Include uppercase and lowercase letters</li>
                  <li>• Add numbers and special characters</li>
                  <li>• Avoid common words or personal information</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Form */}
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

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
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
            </div>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
}
