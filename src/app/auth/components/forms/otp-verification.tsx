import { OTPInput } from '../otp-input';
import { AuthFormContainer } from './auth-form-container';
import { ErrorMessage } from './error-message';

interface OTPVerificationProps {
  title: string;
  subtitle: string;
  email: string;
  error: string;
  loading: boolean;
  onVerify: (otp: string) => void;
  onBack: () => void;
  onResend: () => void;
}

export function OTPVerification({
  title,
  subtitle,
  email,
  error,
  loading,
  onVerify,
  onBack,
  onResend
}: OTPVerificationProps) {
  const fullSubtitle = `${subtitle} ${email}. Please enter the 6-digit code to verify.`;
  
  return (
    <AuthFormContainer
      title={title}
      subtitle={fullSubtitle}
      showBackButton={true}
      backText="Back"
      onBackClick={onBack}
    >
      <ErrorMessage error={error} />

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          OTP Code
        </label>
        <OTPInput onComplete={onVerify} loading={loading} />
      </div>

      <div className="space-y-3">
        <div className="text-gray-600 dark:text-gray-300 text-sm">
          Didn&apos;t receive the code?{' '}
          <button
            onClick={onResend}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Resend
          </button>
        </div>
      </div>
    </AuthFormContainer>
  );
}
