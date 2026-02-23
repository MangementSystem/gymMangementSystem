'use client';
import { Provider } from 'react-redux';
import { store } from '@/lib/redux/store';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  selectNotifications,
  removeNotification,
  selectCurrentOrganization,
  setCurrentOrganization,
} from '@/lib/redux/slices/uiSlice';
import { AppLayout } from '@/components/layout/AppLayout';
import { useGetOrganizationsQuery } from '@/lib/api/organizationsApi';

function NotificationContainer() {
  const notifications = useAppSelector(selectNotifications);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timers = notifications.map((notification) =>
      setTimeout(() => {
        dispatch(removeNotification(notification.id));
      }, 5000),
    );

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
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
              x
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function OrganizationBootstrap() {
  const dispatch = useAppDispatch();
  const currentOrganization = useAppSelector(selectCurrentOrganization);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const { data: organizations } = useGetOrganizationsQuery(undefined, {
    skip: !isAuthenticated || !!currentOrganization,
  });

  useEffect(() => {
    if (!currentOrganization && organizations && organizations.length > 0) {
      dispatch(setCurrentOrganization(organizations[0].id));
    }
  }, [currentOrganization, organizations, dispatch]);

  return null;
}

function InnerProviders({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout>
      <OrganizationBootstrap />
      <NotificationContainer />
      {children}
    </AppLayout>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <InnerProviders>{children}</InnerProviders>
    </Provider>
  );
}
