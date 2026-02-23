'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/lib/redux/hooks';

const publicRoutes = ['/login', '/register', '/unauthorized'];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [mounted, setMounted] = useState(false);
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isPublicRoute && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isPublicRoute, isAuthenticated, router]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <div className="min-h-screen bg-black">{children}</div>;
  }

  if (isPublicRoute) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}
