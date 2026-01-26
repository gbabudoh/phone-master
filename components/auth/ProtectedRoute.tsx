'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { UserRole } from '@/types/user';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredRoles?: UserRole[];
}

export default function ProtectedRoute({ 
  children, 
  requiredRole,
  requiredRoles 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const getDashboardUrl = (role: UserRole) => {
    switch (role) {
      case 'personal_seller':
        return '/personal-seller/dashboard';
      case 'retail_seller':
        return '/retail-seller/dashboard';
      case 'wholesale_seller':
        return '/wholesale-seller/dashboard';
      case 'admin':
        return '/admin/dashboard';
      case 'buyer':
        return '/buyer/dashboard';
      default:
        return '/';
    }
  };

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Check if trying to access admin routes
        if (pathname?.startsWith('/admin')) {
          router.push('/admin/login');
        } else {
          router.push('/login');
        }
        return;
      }

      if (requiredRole && user.role !== requiredRole) {
        router.push(getDashboardUrl(user.role));
        return;
      }

      if (requiredRoles && !requiredRoles.includes(user.role)) {
        router.push(getDashboardUrl(user.role));
        return;
      }
    }
  }, [user, loading, requiredRole, requiredRoles, router, pathname]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-foreground/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requiredRole && user.role !== requiredRole) {
    return null;
  }

  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}

