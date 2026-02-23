'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginMutation } from '@/lib/api/authApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/lib/redux/slices/authSlice';
import { setCurrentOrganization } from '@/lib/redux/slices/uiSlice';
import { Dumbbell, Mail, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading, error }] = useLoginMutation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await login(formData).unwrap();
      dispatch(setCredentials(result));
      // Set organization for all org-scoped queries
      if (result.user?.organizationId) {
        dispatch(setCurrentOrganization(result.user.organizationId));
      }
      router.push('/');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 via-red-600 to-pink-600 p-12 flex-col justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-12">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Dumbbell className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">GYM PRO</h1>
              <p className="text-sm text-white/80">Management System</p>
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-5xl font-bold text-white leading-tight">
              Transform Your
              <br />
              Gym Management
            </h2>
            <p className="text-xl text-white/90">
              AI-powered platform to manage members, workouts, and grow your fitness business.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-3xl font-bold text-white mb-1">500+</div>
            <div className="text-sm text-white/80">Active Gyms</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-3xl font-bold text-white mb-1">50K+</div>
            <div className="text-sm text-white/80">Members</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-3xl font-bold text-white mb-1">99%</div>
            <div className="text-sm text-white/80">Satisfaction</div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">GYM PRO</h1>
                <p className="text-xs text-gray-400">Management System</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-400">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                <p className="text-sm text-red-400">
                  {'data' in error &&
                  typeof error.data === 'object' &&
                  error.data &&
                  'message' in error.data
                    ? String(error.data.message)
                    : 'Login failed. Please check your credentials.'}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-orange-500 text-white transition-colors"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-orange-500 text-white transition-colors"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-orange-500 focus:ring-orange-500"
                />
                <span className="ml-2 text-sm text-gray-400">Remember me</span>
              </label>
              <a
                href="#"
                className="text-sm text-orange-500 hover:text-orange-400 transition-colors"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? (
                'Signing in...'
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="text-orange-500 hover:text-orange-400 font-semibold transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800">
            <p className="text-center text-sm text-gray-500">
              By signing in, you agree to our{' '}
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms
              </a>{' '}
              and{' '}
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
