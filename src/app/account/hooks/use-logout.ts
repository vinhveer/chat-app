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
      await new Promise(resolve => setTimeout(resolve, 1500));
      await signOut();
      setStep('success');
      
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (error) {
      console.error('Logout error:', error);
      setStep('confirm');
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
