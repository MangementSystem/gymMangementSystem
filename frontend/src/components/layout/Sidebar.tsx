"use client";
import { 
  LayoutDashboard, 
  Users, 
  UserCircle, 
  CreditCard, 
  TrendingUp, 
  Package, 
  ClipboardCheck, 
  Calendar, 
  Tablet, 
  Dumbbell, 
  Activity, 
  BookOpen, 
  FileText, 
  Brain, 
  ScanLine, 
  Sparkles, 
  DollarSign, 
  BarChart3, 
  Settings, 
  Building, 
  Sliders,
  ChevronDown,
  ChevronRight,
  Zap
} from 'lucide-react';
import { useState } from 'react';

export const Sidebar = () => {
  const [expandedItems, setExpandedItems] = useState(['members', 'workouts']);
  const [activeLink, setActiveLink] = useState('/');

  const toggleExpand = (label:any) => {
    setExpandedItems(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const menuItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      link: '/',
      gradient: 'from-yellow-400 to-orange-500'
    },
    {
      label: 'Members',
      icon: Users,
      link: '/members',
      gradient: 'from-orange-500 to-red-500',
      subItems: [
        { label: 'All Members', icon: UserCircle, link: '/members' },
        { label: 'Memberships', icon: CreditCard, link: '/memberships' },
        { label: 'Progress Tracking', icon: TrendingUp, link: '/progress' }
      ]
    },
    {
      label: 'Plans & Pricing',
      icon: Package,
      link: '/plans',
      gradient: 'from-yellow-500 to-orange-400'
    },
    {
      label: 'Attendance',
      icon: ClipboardCheck,
      link: '/attendance',
      gradient: 'from-red-500 to-orange-500',
      subItems: [
        { label: 'Attendance Logs', icon: Calendar, link: '/attendance/logs' },
        { label: 'Devices', icon: Tablet, link: '/attendance/devices' }
      ]
    },
    {
      label: 'Workouts',
      icon: Dumbbell,
      link: '/workouts',
      gradient: 'from-orange-400 to-yellow-500',
      subItems: [
        { label: 'Exercises', icon: Activity, link: '/exercises' },
        { label: 'Programs', icon: BookOpen, link: '/workout-programs' },
        { label: 'Workout Logs', icon: FileText, link: '/workout-logs' }
      ]
    },
    {
      label: 'AI Insights',
      icon: Brain,
      link: '/ai-insights',
      gradient: 'from-yellow-500 to-red-500',
      badge: 'NEW',
      subItems: [
        { label: 'Exercise Analysis', icon: ScanLine, link: '/ai/exercise-analysis' },
        { label: 'Member Insights', icon: Sparkles, link: '/ai/insights' }
      ]
    },
    {
      label: 'Payments',
      icon: DollarSign,
      link: '/transactions',
      gradient: 'from-red-400 to-orange-400'
    },
    {
      label: 'Reports',
      icon: BarChart3,
      link: '/reports',
      gradient: 'from-orange-500 to-yellow-500'
    },
    {
      label: 'Settings',
      icon: Settings,
      link: '/settings',
      gradient: 'from-yellow-400 to-red-500',
      subItems: [
        { label: 'Organization', icon: Building, link: '/settings/organization' },
        { label: 'Preferences', icon: Sliders, link: '/settings/preferences' }
      ]
    }
  ];

  return (
    <aside className="w-72 bg-gradient-to-b from-black via-gray-900 to-black h-screen sticky top-0 border-r-4 border-yellow-500 shadow-2xl overflow-y-auto">
      {/* Logo Section */}
      <div className="p-6 border-b-2 border-yellow-500/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/50">
            <Dumbbell className="w-7 h-7 text-black" />
          </div>
          <div>
            <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              GYM PRO
            </h2>
            <p className="text-xs text-gray-400 font-bold">Management System</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4 border-b-2 border-yellow-500/30">
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-4 border border-yellow-500/20">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="text-xs font-black text-gray-400">TODAY'S ACTIVITY</span>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <p className="text-2xl font-black text-yellow-400">45</p>
              <p className="text-xs text-gray-500 font-medium">Check-ins</p>
            </div>
            <div>
              <p className="text-2xl font-black text-orange-400">12</p>
              <p className="text-xs text-gray-500 font-medium">New Members</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isExpanded = expandedItems.includes(item.label.toLowerCase().replace(/\s+/g, '-'));
          const isActive = activeLink === item.link;
          const hasSubItems = item.subItems && item.subItems.length > 0;

          return (
            <div key={item.label}>
              {/* Main Menu Item */}
              <button
                onClick={() => {
                  if (hasSubItems) {
                    toggleExpand(item.label.toLowerCase().replace(/\s+/g, '-'));
                  } else {
                    setActiveLink(item.link);
                  }
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all group ${
                  isActive 
                    ? `bg-gradient-to-r ${item.gradient} shadow-lg shadow-yellow-500/30` 
                    : 'hover:bg-gray-800 hover:border hover:border-yellow-500/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-black' : 'text-yellow-400 group-hover:text-orange-400'}`} />
                  <span className={`text-sm font-black ${isActive ? 'text-black' : 'text-gray-200 group-hover:text-yellow-400'}`}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="px-2 py-0.5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-black rounded-full animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </div>
                {hasSubItems && (
                  <div className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-black' : 'text-gray-400'}`} />
                  </div>
                )}
              </button>

              {/* Sub Menu Items */}
              {hasSubItems && isExpanded && (
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-yellow-500/20 pl-4">
                  {item.subItems.map((subItem) => {
                    const SubIcon = subItem.icon;
                    const isSubActive = activeLink === subItem.link;

                    return (
                      <button
                        key={subItem.label}
                        onClick={() => setActiveLink(subItem.link)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm ${
                          isSubActive
                            ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 text-yellow-400 font-black'
                            : 'text-gray-400 hover:text-orange-400 hover:bg-gray-800 font-bold'
                        }`}
                      >
                        <SubIcon className="w-4 h-4" />
                        <span>{subItem.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom Section - Upgrade Card */}
      <div className="p-4 mt-6">
        <div className="bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 rounded-xl p-5 shadow-2xl shadow-yellow-500/50">
          <div className="text-center">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="font-black text-black text-lg mb-1">Upgrade to PRO</h3>
            <p className="text-xs text-black/80 font-bold mb-4">
              Unlock AI insights and advanced analytics
            </p>
            <button className="w-full bg-black hover:bg-gray-900 text-yellow-400 font-black py-2.5 rounded-lg transition-all transform hover:scale-105">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};