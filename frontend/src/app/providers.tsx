"use client";
import { Provider } from 'react-redux';
import { store } from '@/lib/redux/store';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { selectNotifications, removeNotification } from '@/lib/redux/slices/uiSlice';

function NotificationContainer() {
  const notifications = useAppSelector(selectNotifications);
  const dispatch = useAppDispatch();

  useEffect(() => {
    notifications.forEach((notification) => {
      const timer = setTimeout(() => {
        dispatch(removeNotification(notification.id));
      }, 5000);
      return () => clearTimeout(timer);
    });
  }, [notifications, dispatch]);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg shadow-lg border-2 font-bold animate-slide-in ${
            notification.type === 'success'
              ? 'bg-green-500/20 border-green-500/50 text-green-400'
              : notification.type === 'error'
              ? 'bg-red-500/20 border-red-500/50 text-red-400'
              : notification.type === 'warning'
              ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
              : 'bg-blue-500/20 border-blue-500/50 text-blue-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <p>{notification.message}</p>
            <button
              onClick={() => dispatch(removeNotification(notification.id))}
              className="ml-4 text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function InnerProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NotificationContainer />
      {children}
    </>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <InnerProviders>{children}</InnerProviders>
    </Provider>
  );
}
