'use client';

import { useRouter } from 'next/navigation';
import {
  Users,
  Activity,
  DollarSign,
  Dumbbell,
  TrendingUp,
  Clock,
  AlertCircle,
  UserPlus,
  BookOpen,
  BarChart3,
} from 'lucide-react';
import { useGetMembersQuery } from '@/lib/api/membersApi';
import { useGetAttendanceLogsQuery } from '@/lib/api/attendanceApi';
import { useGetTransactionsQuery } from '@/lib/api/transactionsApi';
import { useGetWorkoutLogsQuery } from '@/lib/api/workoutLogsApi';
import { useAppSelector } from '@/lib/redux/hooks';
import { selectCurrentOrganization } from '@/lib/redux/slices/uiSlice';

export default function DashboardPage() {
  const router = useRouter();
  const currentOrganization = useAppSelector(selectCurrentOrganization);
  const today = new Date().toISOString().split('T')[0];
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .split('T')[0];

  const { data: members } = useGetMembersQuery({
    organizationId: currentOrganization || undefined,
  });
  const { data: todayLogs } = useGetAttendanceLogsQuery({
    organizationId: currentOrganization || undefined,
    startDate: today,
    endDate: today,
  });
  const { data: monthlyTransactions } = useGetTransactionsQuery({
    organizationId: currentOrganization || undefined,
    startDate: monthStart,
    endDate: today,
  });
  const { data: workoutLogs } = useGetWorkoutLogsQuery({ startDate: today, endDate: today });

  const totalRevenue =
    monthlyTransactions?.reduce((sum: number, t: any) => {
      const isExpense = t.type === 'expense' || t.type === 'refund' || Number(t.amount) < 0;
      return isExpense ? sum : sum + Math.abs(Number(t.amount));
    }, 0) ?? 0;

  const stats = [
    {
      title: 'Total Members',
      value: members?.length ?? 0,
      change: '+45%',
      icon: Users,
      color: 'from-orange-500 to-red-600',
    },
    {
      title: "Today's Check-ins",
      value: todayLogs?.length ?? 0,
      change: '+8%',
      icon: Activity,
      color: 'from-red-500 to-pink-600',
    },
    {
      title: 'Monthly Revenue',
      value: `$${totalRevenue.toFixed(0)}`,
      change: '+23%',
      icon: DollarSign,
      color: 'from-yellow-500 to-orange-600',
    },
    {
      title: 'Active Workouts',
      value: workoutLogs?.length ?? 0,
      change: '+12%',
      icon: Dumbbell,
      color: 'from-orange-500 to-red-600',
    },
  ];

  const quickActions = [
    {
      name: 'Add New Member',
      color: 'from-yellow-500 to-orange-600',
      icon: UserPlus,
      href: '/members',
    },
    {
      name: 'Create Workout Plan',
      color: 'from-orange-500 to-red-600',
      icon: BookOpen,
      href: '/workout-programs',
    },
    {
      name: 'Record Payment',
      color: 'from-red-500 to-pink-600',
      icon: DollarSign,
      href: '/transactions',
    },
    {
      name: 'View Reports',
      color: 'from-orange-500 to-yellow-600',
      icon: BarChart3,
      href: '/reports',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gradient-to-r from-gray-900 to-black">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back! Here&apos;s what&apos;s happening today.</p>
        </div>
      </div>

      <div className="p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 hover:border-orange-500/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center text-sm font-semibold text-green-500">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {stat.change}
                </div>
              </div>
              <div className="text-sm text-gray-400 mb-1">{stat.title}</div>
              <div className="text-3xl font-bold">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-orange-500">Recent Check-ins</h2>
              <button
                onClick={() => router.push('/attendance/logs')}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                View All
              </button>
            </div>
            <div className="space-y-4">
              {todayLogs && todayLogs.length > 0 ? (
                todayLogs.slice(0, 5).map((log: any) => {
                  const name = log.member
                    ? `${log.member.first_name ?? ''} ${log.member.last_name ?? ''}`.trim()
                    : 'Unknown Member';
                  const initials = name
                    .split(' ')
                    .map((n: string) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);
                  return (
                    <div
                      key={log.id}
                      className="flex items-center justify-between p-4 bg-black/30 rounded-lg hover:bg-black/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-sm font-bold">
                          {initials || '?'}
                        </div>
                        <div>
                          <div className="font-semibold">{name}</div>
                          <div className="text-sm text-gray-400">
                            {log.check_out ? 'Checked out' : 'Checked in'}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-400 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(log.check_in).toLocaleTimeString()}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-2 opacity-40" />
                  <p>No check-ins today yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center mr-3">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold">Quick Actions</h2>
            </div>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => router.push(action.href)}
                  className={`w-full py-3 px-4 bg-gradient-to-r ${action.color} rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2`}
                >
                  <action.icon className="w-5 h-5" />
                  {action.name}
                </button>
              ))}
            </div>

            {/* Alert */}
            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-yellow-500 mb-1">REMINDER</div>
                  <div className="text-sm text-gray-300">
                    Peak hours: 6-9 PM. Consider adding more classes during this time.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
