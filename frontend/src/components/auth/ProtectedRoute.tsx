'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import type { RootState } from '@/lib/redux/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'super_admin' | 'admin' | 'trainer' | 'member'>;
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.push('/unauthorized');
    }
  }, [isAuthenticated, user, allowedRoles, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
