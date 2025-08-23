import { useState } from 'react';
import { useAuth } from '@/data/auth';
import { useRouter } from 'next/navigation';

type LogoutStep = 'confirm' | 'logging-out' | 'success';

export function useLogout() {
  const { signOut } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<LogoutStep>('confirm');

  const handleLogout = async () => {
    setStep('logging-out');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await signOut();
      setStep('success');
      
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, redirect to home
      router.push('/');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return {
    step,
    handleLogout,
    handleCancel
  };
}
