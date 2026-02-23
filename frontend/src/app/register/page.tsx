'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRegisterMutation } from '@/lib/api/authApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/lib/redux/slices/authSlice';

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [register, { isLoading, error }] = useRegisterMutation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'member' as 'admin' | 'trainer' | 'member',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await register(formData).unwrap();
      dispatch(setCredentials(result));
      router.push('/');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">
                {'data' in error &&
                typeof error.data === 'object' &&
                error.data &&
                'message' in error.data
                  ? String(error.data.message)
                  : 'Registration failed. Please try again.'}
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Min 8 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                id="role"
                name="role"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value as 'admin' | 'trainer' | 'member',
                  })
                }
              >
                <option value="member">Member</option>
                <option value="trainer">Trainer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Creating account...' : 'Register'}
            </button>
          </div>

          <div className="text-center">
            <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Already have an account? Sign in
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
