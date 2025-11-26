"use client";
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Activity,
  Calendar,
  Dumbbell,
  Brain,
  Zap,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useGetMembersQuery } from '@/lib/api/membersApi';
import { useGetAttendanceLogsQuery } from '@/lib/api/attendanceApi';
import { useGetTransactionsQuery } from '@/lib/api/transactionsApi';
import { useGetWorkoutLogsQuery } from '@/lib/api/workoutLogsApi';
import { useAppSelector } from '@/lib/redux/hooks';
import { selectCurrentOrganization } from '@/lib/redux/slices/uiSlice';

export default function DashboardPage() {
  const currentOrganization = useAppSelector(selectCurrentOrganization);
  
  const today = new Date().toISOString().split('T')[0];
  const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const { data: members } = useGetMembersQuery({ organizationId: currentOrganization || undefined });
  const { data: attendanceLogs } = useGetAttendanceLogsQuery({ startDate: today, endDate: today });
  const { data: transactions } = useGetTransactionsQuery({ 
    organizationId: currentOrganization || undefined,
    startDate: lastMonth,
    endDate: today
  });
  const { data: workoutLogs } = useGetWorkoutLogsQuery({ startDate: lastMonth, endDate: today });

  const stats = [
    {
      title: 'Total Members',
      value: members?.length || 0,
      change: '+12%',
      trend: 'up',
      icon: Users,
      gradient: 'from-yellow-400 to-orange-500',
      bgGradient: 'from-yellow-500/10 to-orange-500/10'
    },
    {
      title: "Today's Check-ins",
      value: attendanceLogs?.filter(log => log.check_in)?.length || 0,
      change: '+8%',
      trend: 'up',
      icon: Activity,
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-500/10 to-red-500/10'
    },
    {
      title: 'Monthly Revenue',
      value: `$${transactions?.reduce((sum, t) => sum + Number(t.amount), 0).toFixed(2) || 0}`,
      change: '+23%',
      trend: 'up',
      icon: DollarSign,
      gradient: 'from-yellow-500 to-red-500',
      bgGradient: 'from-yellow-500/10 to-red-500/10'
    },
    {
      title: 'Active Workouts',
      value: workoutLogs?.length || 0,
      change: '-4%',
      trend: 'down',
      icon: Dumbbell,
      gradient: 'from-red-500 to-orange-400',
      bgGradient: 'from-red-500/10 to-orange-400/10'
    }
  ];

  const recentActivities = [
    { member: 'John Doe', action: 'Checked in', time: '10 mins ago', icon: Activity },
    { member: 'Sarah Smith', action: 'Completed workout', time: '25 mins ago', icon: Dumbbell },
    { member: 'Mike Johnson', action: 'New membership', time: '1 hour ago', icon: Users },
    { member: 'Emma Wilson', action: 'AI analysis completed', time: '2 hours ago', icon: Brain },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-2">
          Dashboard
        </h1>
        <p className="text-gray-400 font-bold">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? ArrowUp : ArrowDown;
          
          return (
            <div 
              key={stat.title}
              className={`bg-gradient-to-br ${stat.bgGradient} border border-yellow-500/20 rounded-xl p-6 hover:border-yellow-500/50 transition-all hover:scale-105 transform`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-black" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-black ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                  <TrendIcon className="w-4 h-4" />
                  {stat.change}
                </div>
              </div>
              <p className="text-gray-400 text-sm font-bold mb-1">{stat.title}</p>
              <p className="text-3xl font-black text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-gradient-to-br from-gray-900/50 to-black border-2 border-yellow-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              Recent Activity
            </h2>
            <Calendar className="w-5 h-5 text-yellow-400" />
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity, index) => {
              const ActivityIcon = activity.icon;
              return (
                <div 
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 rounded-lg border border-yellow-500/10 hover:border-yellow-500/30 transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                    <ActivityIcon className="w-5 h-5 text-black" />
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-white">{activity.member}</p>
                    <p className="text-sm text-gray-400 font-medium">{activity.action}</p>
                  </div>
                  <span className="text-xs text-gray-500 font-bold">{activity.time}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-gray-900/50 to-black border-2 border-yellow-500/20 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-6 h-6 text-yellow-400" />
            <h2 className="text-xl font-black text-white">Quick Actions</h2>
          </div>
          
          <div className="space-y-3">
            {[
              { label: 'Add New Member', gradient: 'from-yellow-400 to-orange-500' },
              { label: 'Create Workout Plan', gradient: 'from-orange-500 to-red-500' },
              { label: 'Record Payment', gradient: 'from-yellow-500 to-red-500' },
              { label: 'View Reports', gradient: 'from-red-400 to-orange-400' },
            ].map((action) => (
              <button
                key={action.label}
                className={`w-full bg-gradient-to-r ${action.gradient} text-black font-black py-3 rounded-lg hover:scale-105 transform transition-all shadow-lg hover:shadow-xl`}
              >
                {action.label}
              </button>
            ))}
          </div>

          {/* AI Insight Card */}
          <div className="mt-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-yellow-400" />
              <span className="text-xs font-black text-yellow-400">AI INSIGHT</span>
            </div>
            <p className="text-sm text-gray-300 font-bold">
              Peak hours: 6-8 PM. Consider adding more classes during this time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}