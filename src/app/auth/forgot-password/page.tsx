'use client';


import { useForgotPassword } from '../hooks';
import { AuthFormContainer, AuthInput, AuthButton, ErrorMessage, OTPVerification } from '../components/forms';

export default function ForgotPasswordPage() {
  const {
    email,
    setEmail,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    otpLoading,
    error,
    step,
    setStep,
    handleEmailSubmit,
    handleOTPVerify,
    handlePasswordReset,
    handleResendOTP
  } = useForgotPassword();

  if (step === 'otp') {
    return (
      <OTPVerification
        title="Verify Recovery"
        subtitle="We sent an OTP code to"
        email={email}
        error={error}
        loading={otpLoading}
        onVerify={handleOTPVerify}
        onBack={() => setStep('email')}
        onResend={handleResendOTP}
      />
    );
  }

  if (step === 'password') {
    return (
      <AuthFormContainer
        title="Reset Password"
        subtitle="Enter a new password for your account"
      >
        <form onSubmit={handlePasswordReset} className="space-y-6">
          <ErrorMessage error={error} />

          <AuthInput
            id="newPassword"
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            helperText="Minimum 6 characters"
            required
          />

          <AuthInput
            id="confirmPassword"
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <AuthButton
            type="submit"
            loading={loading}
            loadingText="Updating password..."
          >
            Update Password
          </AuthButton>
        </form>
      </AuthFormContainer>
    );
  }

  return (
    <AuthFormContainer
      title="Forgot Password"
      subtitle="Enter your email to receive password recovery instructions"
      showBackButton={true}
    >
      <form onSubmit={handleEmailSubmit} className="space-y-6">
        <ErrorMessage error={error} />

        <AuthInput
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
        />

        <AuthButton
          type="submit"
          loading={loading}
          loadingText="Sending email..."
        >
          Send Recovery Email
        </AuthButton>
      </form>
    </AuthFormContainer>
  );
}
