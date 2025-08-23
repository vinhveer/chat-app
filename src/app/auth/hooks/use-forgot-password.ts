'use client';

import { useState } from 'react';
import { AuthService } from '@/data/auth';
import { supabase } from '@/lib/supabase';

export function useForgotPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await AuthService.resetPassword(email);
      if (error) {
        setError(error.message);
      } else {
        setStep('otp');
      }
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi gửi email khôi phục');
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
        type: 'recovery'
      });

      if (error) {
        setError(error.message);
      } else {
        setStep('password');
      }
    } catch (err: any) {
      setError(err.message || 'Mã OTP không hợp lệ');
    } finally {
      setOtpLoading(false);
    }
  };

  const validateNewPassword = () => {
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return false;
    }

    if (newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }

    return true;
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateNewPassword()) {
      setLoading(false);
      return;
    }

    try {
      const { error } = await AuthService.updatePassword(newPassword);
      if (error) {
        setError(error.message);
      }
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi đặt lại mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    handleEmailSubmit({ preventDefault: () => {} } as React.FormEvent);
  };

  const resetForm = () => {
    setEmail('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setStep('email');
  };

  return {
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
    handleResendOTP,
    resetForm
  };
}
