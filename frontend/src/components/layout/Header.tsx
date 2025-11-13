"use client";
import { Search, Bell, Plus, UserCircle, Settings, LogOut, User, ChevronDown, Dumbbell, Activity, TrendingUp, Zap } from 'lucide-react';
import { useState } from 'react';

export const Header = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock data - replace with actual data from your backend
  const notifications = [
    { id: 1, type: 'membership', message: 'John Doe membership expires in 3 days', time: '2 hours ago', icon: '⚠️' },
    { id: 2, type: 'payment', message: 'New payment received: $150', time: '5 hours ago', icon: '💰' },
    { id: 3, type: 'alert', message: '5 members checked in today', time: '1 day ago', icon: '✅' },
    { id: 4, type: 'workout', message: 'New workout program created for Sarah', time: '1 day ago', icon: '💪' }
  ];

  const unreadCount = 4;

  return (
    <header className="bg-gradient-to-r from-black via-gray-900 to-black shadow-2xl border-b-4 border-yellow-500 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      {/* Left Section - Title & Quick Stats */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
            <Dumbbell className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
              GYM SYSTEM
            </h1>
            <p className="text-xs text-gray-400 font-medium">Management Dashboard</p>
          </div>
        </div>
        
        <div className="hidden lg:flex items-center gap-3 ml-6">
          <div className="group relative px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg hover:border-yellow-500 transition-all">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-yellow-400" />
              <div>
                <p className="text-xs text-gray-400 font-medium">Check-ins Today</p>
                <p className="text-lg font-black text-yellow-400">45</p>
              </div>
            </div>
          </div>
          
          <div className="group relative px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-lg hover:border-orange-500 transition-all">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-orange-400" />
              <div>
                <p className="text-xs text-gray-400 font-medium">Active Members</p>
                <p className="text-lg font-black text-orange-400">312</p>
              </div>
            </div>
          </div>

          <div className="group relative px-4 py-2 bg-gradient-to-r from-red-500/20 to-yellow-500/20 border border-red-500/30 rounded-lg hover:border-red-500 transition-all">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-red-400" />
              <div>
                <p className="text-xs text-gray-400 font-medium">Revenue Today</p>
                <p className="text-lg font-black text-red-400">$2.4K</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="hidden md:flex items-center bg-gray-800 border-2 border-gray-700 rounded-lg px-4 py-2.5 w-72 hover:border-yellow-500 transition-all focus-within:border-yellow-500 focus-within:shadow-lg focus-within:shadow-yellow-500/20">
          <Search className="w-5 h-5 text-yellow-400 mr-2" />
          <input
            type="text"
            placeholder="Search members, workouts, plans..."
            className="bg-transparent outline-none text-sm w-full text-gray-200 placeholder-gray-500 font-medium"
          />
        </div>

        {/* Quick Actions */}
        <button className="hidden md:flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black px-5 py-2.5 rounded-lg font-black transition-all shadow-lg hover:shadow-yellow-500/50 transform hover:scale-105">
          <Plus className="w-5 h-5" />
          Add Member
        </button>

        <button className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white px-5 py-2.5 rounded-lg font-black transition-all shadow-lg hover:shadow-orange-500/50 transform hover:scale-105">
          <Activity className="w-5 h-5" />
          Check-in
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all border-2 border-gray-700 hover:border-yellow-500 group"
          >
            <Bell className="w-5 h-5 text-yellow-400 group-hover:animate-pulse" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs rounded-full flex items-center justify-center font-black shadow-lg animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-96 bg-gray-900 rounded-xl shadow-2xl border-2 border-yellow-500/30 overflow-hidden z-50">
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 px-5 py-4 border-b-2 border-yellow-500/30">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-yellow-400 text-lg">Notifications</h3>
                  <span className="px-3 py-1 bg-red-500 text-white text-xs font-black rounded-full">
                    {unreadCount} New
                  </span>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="px-5 py-4 hover:bg-gradient-to-r hover:from-yellow-500/10 hover:to-orange-500/10 cursor-pointer border-b border-gray-800 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{notif.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-200 font-medium">{notif.message}</p>
                        <p className="text-xs text-gray-500 mt-1 font-medium">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-5 py-3 bg-gray-800 border-t-2 border-yellow-500/30">
                <button className="text-sm text-yellow-400 hover:text-yellow-300 font-black w-full text-center">
                  View All Notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-2 pr-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all border-2 border-gray-700 hover:border-yellow-500 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-lg">
              <User className="w-6 h-6 text-black" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-black text-yellow-400">Admin User</p>
              <p className="text-xs text-gray-400 font-medium">Owner</p>
            </div>
            <ChevronDown className="w-4 h-4 text-yellow-400 group-hover:text-orange-400" />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-64 bg-gray-900 rounded-xl shadow-2xl border-2 border-yellow-500/30 overflow-hidden z-50">
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 px-5 py-4 border-b-2 border-yellow-500/30">
                <p className="font-black text-yellow-400">Admin User</p>
                <p className="text-sm text-gray-400 font-medium">admin@gym.com</p>
              </div>
              <button className="w-full px-5 py-3 text-left hover:bg-gradient-to-r hover:from-yellow-500/10 hover:to-orange-500/10 flex items-center gap-3 text-sm text-gray-200 font-bold transition-all border-b border-gray-800">
                <UserCircle className="w-5 h-5 text-yellow-400" />
                My Profile
              </button>
              <button className="w-full px-5 py-3 text-left hover:bg-gradient-to-r hover:from-yellow-500/10 hover:to-orange-500/10 flex items-center gap-3 text-sm text-gray-200 font-bold transition-all border-b border-gray-800">
                <Settings className="w-5 h-5 text-orange-400" />
                Settings
              </button>
              <div className="bg-gray-800/50">
                <button className="w-full px-5 py-3 text-left hover:bg-red-500/20 flex items-center gap-3 text-sm text-red-400 font-black transition-all">
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};