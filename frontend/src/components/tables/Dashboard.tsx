"use client";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { 
  Users, 
  CreditCard, 
  Wifi, 
  TrendingUp, 
  DollarSign, 
  Activity,
  Calendar,
  Zap,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    members: 0,
    plans: 0,
    devices: 0,
    activeMemberships: 0,
    totalRevenue: 0,
    membersGrowth: 0,
    revenueGrowth: 0,
  });
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [membersData, setMembersData] = useState<any[]>([]);

  useEffect(() => {
    setStats({
      members: 245,
      plans: 6,
      devices: 3,
      activeMemberships: 180,
      totalRevenue: 12350,
      membersGrowth: 12.5,
      revenueGrowth: 8.3,
    });

    setRevenueData([
      { month: "Jan", revenue: 3200 },
      { month: "Feb", revenue: 2800 },
      { month: "Mar", revenue: 3500 },
      { month: "Apr", revenue: 4100 },
      { month: "May", revenue: 3900 },
      { month: "Jun", revenue: 4600 },
    ]);

    setMembersData([
      { month: "Jan", members: 40 },
      { month: "Feb", members: 35 },
      { month: "Mar", members: 50 },
      { month: "Apr", members: 70 },
      { month: "May", members: 65 },
      { month: "Jun", members: 85 },
    ]);
  }, []);

  type CustomTooltipProps = {
    active?: boolean;
    payload?: Array<any> | undefined;
    label?: string | number | undefined;
  };

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    // defensive checks: active and payload may be undefined
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border-2 border-yellow-500/30 rounded-lg p-3 shadow-xl">
          <p className="text-yellow-400 font-black text-sm">{label}</p>
          <p className="text-gray-200 font-bold">
            {payload[0].dataKey === 'revenue' ? '$' : ''}{payload[0].value}
            {payload[0].dataKey === 'members' ? ' Members' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
            <Activity className="w-7 h-7 text-black" />
          </div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
            Dashboard Overview
          </h1>
        </div>
        <p className="text-gray-400 font-medium ml-15">Real-time gym performance metrics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
        <StatCard 
          title="Total Members" 
          value={stats.members} 
          icon={Users}
          gradient="from-blue-500 to-cyan-500"
          growth={stats.membersGrowth}
        />
        <StatCard 
          title="Membership Plans" 
          value={stats.plans} 
          icon={CreditCard}
          gradient="from-green-500 to-emerald-500"
        />
        <StatCard 
          title="Connected Devices" 
          value={stats.devices} 
          icon={Wifi}
          gradient="from-purple-500 to-pink-500"
        />
        <StatCard 
          title="Active Memberships" 
          value={stats.activeMemberships} 
          icon={TrendingUp}
          gradient="from-yellow-500 to-orange-500"
        />
        <StatCard 
          title="Total Revenue" 
          value={`$${stats.totalRevenue.toLocaleString()}`} 
          icon={DollarSign}
          gradient="from-orange-500 to-red-500"
          growth={stats.revenueGrowth}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-gray-900 rounded-xl shadow-2xl border-2 border-yellow-500/30 overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 px-6 py-4 border-b-2 border-yellow-500/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-red-500 rounded-lg flex items-center justify-center shadow-lg">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  Revenue Overview
                </h2>
                <p className="text-sm text-gray-400 font-medium">Monthly earnings trend</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                <YAxis stroke="#9CA3AF" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#ec4899"
                  strokeWidth={3}
                  dot={{ fill: '#ec4899', r: 6, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 8, strokeWidth: 2 }}
                  fill="url(#revenueGradient)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-gray-800/50 px-6 py-3 border-t-2 border-gray-800 flex items-center justify-between">
            <span className="text-sm text-gray-400 font-medium">Last 6 months</span>
            <div className="flex items-center gap-2 text-green-400">
              <ArrowUp className="w-4 h-4" />
              <span className="text-sm font-black">+18.2%</span>
            </div>
          </div>
        </div>

        {/* Members Chart */}
        <div className="bg-gray-900 rounded-xl shadow-2xl border-2 border-yellow-500/30 overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 px-6 py-4 border-b-2 border-yellow-500/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  New Members
                </h2>
                <p className="text-sm text-gray-400 font-medium">Monthly registration growth</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={membersData}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                <YAxis stroke="#9CA3AF" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="members" 
                  fill="url(#barGradient)" 
                  radius={[8, 8, 0, 0]}
                  maxBarSize={60}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-gray-800/50 px-6 py-3 border-t-2 border-gray-800 flex items-center justify-between">
            <span className="text-sm text-gray-400 font-medium">Last 6 months</span>
            <div className="flex items-center gap-2 text-green-400">
              <ArrowUp className="w-4 h-4" />
              <span className="text-sm font-black">+112.5%</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  gradient: string;
  growth?: number;
};

// annotate props for TypeScript
function StatCard({ title, value, icon: Icon, gradient, growth }: StatCardProps) {
  return (
    <div className="bg-gray-900 rounded-xl shadow-2xl border-2 border-gray-800 hover:border-yellow-500/50 transition-all group overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {growth !== undefined && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${growth >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {growth >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              <span className="text-xs font-black">{Math.abs(growth)}%</span>
            </div>
          )}
        </div>
        <h3 className="text-sm font-medium text-gray-400 mb-1">{title}</h3>
        <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
          {value}
        </p>
      </div>
      <div className={`h-1 bg-gradient-to-r ${gradient} opacity-50`}></div>
    </div>
  );
}