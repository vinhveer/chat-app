'use client';

import { useState } from 'react';
import { useAuth } from '@/data/auth';
import { supabase } from '@/lib/supabase';

export function useSignup() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'signup' | 'verify'>('signup');
  const [otpLoading, setOtpLoading] = useState(false);

  const { signUp } = useAuth();

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return false;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!displayName.trim()) {
      setError('Username is required');
      setLoading(false);
      return;
    }

    if (displayName.length < 3) {
      setError('Username must be at least 3 characters');
      setLoading(false);
      return;
    }

    if (displayName.length > 20) {
      setError('Username must be less than 20 characters');
      setLoading(false);
      return;
    }

    // Check for valid characters (only alphanumeric and underscores)
    if (!/^[a-zA-Z0-9_]+$/.test(displayName)) {
      setError('Username can only contain letters, numbers, and underscores');
      setLoading(false);
      return;
    }

    // Must start with a letter or number (not underscore)
    if (!/^[a-zA-Z0-9]/.test(displayName)) {
      setError('Username must start with a letter or number');
      setLoading(false);
      return;
    }

    if (!validatePassword()) {
      setLoading(false);
      return;
    }

    try {
      await signUp(email, password, { displayName: displayName.trim() });
      setStep('verify');
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi đăng ký');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerify = async (otp: string) => {
    setOtpLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'signup'
      });

      if (error) {
        setError(error.message);
      }
    } catch (err: any) {
      setError(err.message || 'Mã OTP không hợp lệ');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOTP = () => {
    handleSubmit({ preventDefault: () => {} } as React.FormEvent);
  };

  const resetForm = () => {
    setDisplayName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setStep('signup');
  };

  return {
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
    handleResendOTP,
    resetForm
  };
}
