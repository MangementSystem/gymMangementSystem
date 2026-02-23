'use client';

import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="bg-white shadow-md rounded-lg p-8">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don&apos;t have permission to access this page.</p>
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
