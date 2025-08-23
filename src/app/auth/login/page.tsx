'use client';

import Link from 'next/link';
import { useLogin } from '../hooks';
import { AuthFormContainer, AuthInput, AuthButton, ErrorMessage } from '../components/forms';

export default function LoginPage() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleSubmit
  } = useLogin();

  return (
    <AuthFormContainer
      title="Sign In"
      subtitle="Welcome back to your account"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
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

        <AuthInput
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        <AuthButton
          type="submit"
          loading={loading}
          loadingText="Signing in..."
        >
          Sign In
        </AuthButton>
      </form>

      <div className="mt-6 space-y-3">
        <div>
          <Link
            href="/auth/forgot-password"
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            Forgot password?
          </Link>
        </div>
        <div className="text-gray-600 dark:text-gray-300 text-sm">
                      Don&apos;t have an account?{' '}
          <Link
            href="/auth/signup"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign up now
          </Link>
        </div>
      </div>
    </AuthFormContainer>
  );
}
