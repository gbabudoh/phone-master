'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

export default function DashboardRedirect() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');
        return;
      }
      
      // Redirect based on user role
      switch (user.role) {
        case 'personal_seller':
          router.replace('/personal-seller/dashboard');
          break;
        case 'retail_seller':
          router.replace('/retail-seller/dashboard');
          break;
        case 'wholesale_seller':
          router.replace('/wholesale-seller/dashboard');
          break;
        case 'admin':
          router.replace('/admin/dashboard');
          break;
        case 'buyer':
          router.replace('/buyer/dashboard');
          break;
        default:
          router.replace('/');
      }
    }
  }, [router, user, loading]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="mt-4 text-foreground/60">Redirecting...</p>
      </div>
    </div>
  );
}
