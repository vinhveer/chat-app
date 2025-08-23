'use client';

import Link from 'next/link';
import { useSignup } from '../hooks';
import { AuthFormContainer, AuthInput, AuthButton, ErrorMessage, OTPVerification } from '../components/forms';

export default function SignupPage() {
  const {
    displayName,
    setDisplayName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    error,
    step,
    setStep,
    otpLoading,
    handleSubmit,
    handleOTPVerify,
    handleResendOTP
  } = useSignup();

  if (step === 'verify') {
    return (
      <OTPVerification
        title="Xác nhận đăng ký"
        subtitle="Chúng tôi đã gửi mã OTP đến"
        email={email}
        error={error}
        loading={otpLoading}
        onVerify={handleOTPVerify}
        onBack={() => setStep('signup')}
        onResend={handleResendOTP}
      />
    );
  }

  return (
    <AuthFormContainer
      title="Create Account"
      subtitle="Sign up for a new account to get started"
      showBackButton={true}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <ErrorMessage error={error} />

        <AuthInput
          id="displayName"
          label="Username"
          type="text"
          value={displayName}
          onChange={(e) => {
            // Only allow alphanumeric characters and underscores
            const value = e.target.value.replace(/[^a-zA-Z0-9_]/g, '');
            setDisplayName(value);
          }}
          placeholder="username_123"
          helperText="Only letters, numbers, and underscores allowed"
          required
        />

        <AuthInput
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
        />

        <AuthInput
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          helperText="Minimum 6 characters"
          required
        />

        <AuthInput
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        <AuthButton
          type="submit"
          loading={loading}
          loadingText="Creating account..."
        >
          Create Account
        </AuthButton>
      </form>

      <div className="mt-6">
        <div className="text-gray-600 dark:text-gray-300 text-sm">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign in now
          </Link>
        </div>
      </div>
    </AuthFormContainer>
  );
}
