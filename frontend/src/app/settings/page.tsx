'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, LogOut, Settings as SettingsIcon, Sliders, Wifi } from 'lucide-react';
import { useGetProfileQuery } from '@/lib/api/authApi';
import { useAppDispatch } from '@/lib/redux/hooks';
import { logout } from '@/lib/redux/slices/authSlice';
import { addNotification, setCurrentOrganization } from '@/lib/redux/slices/uiSlice';

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: profile } = useGetProfileQuery();
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);

  const handleCheckConnection = async () => {
    setIsCheckingHealth(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${apiBase}/health`);

      if (!response.ok) {
        throw new Error('Health check failed');
      }

      dispatch(addNotification({ type: 'success', message: 'Backend connection is healthy' }));
    } catch {
      dispatch(addNotification({ type: 'error', message: 'Backend connection failed' }));
    } finally {
      setIsCheckingHealth(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(setCurrentOrganization(null));
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-gray-800 bg-gradient-to-r from-gray-900 to-black">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-gray-400">
            Manage organization settings, preferences, and connection checks
          </p>
        </div>
      </div>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => router.push('/settings/organization')}
            className="text-left bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 hover:border-orange-500/50 transition-all"
          >
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold mb-2">Organization</h2>
            <p className="text-gray-400">Update organization name, address, and phone.</p>
          </button>

          <button
            onClick={() => router.push('/settings/preferences')}
            className="text-left bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 hover:border-orange-500/50 transition-all"
          >
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center mb-4">
              <Sliders className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold mb-2">Preferences</h2>
            <p className="text-gray-400">
              Save local theme, language, and notification preferences.
            </p>
          </button>

          <button
            onClick={handleCheckConnection}
            disabled={isCheckingHealth}
            className="text-left bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 hover:border-orange-500/50 transition-all disabled:opacity-60"
          >
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-4">
              <Wifi className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold mb-2">Connection Check</h2>
            <p className="text-gray-400">
              {isCheckingHealth
                ? 'Checking backend health...'
                : 'Verify API connectivity using /health.'}
            </p>
          </button>

          <button
            onClick={handleLogout}
            className="text-left bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 hover:border-red-500/50 transition-all"
          >
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center mb-4">
              <LogOut className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold mb-2">Logout</h2>
            <p className="text-gray-400">Sign out and clear local session tokens.</p>
          </button>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mr-3">
              <SettingsIcon className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold">Session</h2>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <div className="text-gray-400">Name</div>
              <div className="font-semibold">
                {profile ? `${profile.firstName} ${profile.lastName}` : 'Unknown'}
              </div>
            </div>
            <div>
              <div className="text-gray-400">Email</div>
              <div className="font-semibold">{profile?.email || 'Unknown'}</div>
            </div>
            <div>
              <div className="text-gray-400">Role</div>
              <div className="font-semibold capitalize">{profile?.role || 'Unknown'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
