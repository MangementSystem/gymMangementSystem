'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  TrendingUp,
  Calendar,
  Dumbbell,
  Brain,
  DollarSign,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  Activity,
  ClipboardList,
  Target,
} from 'lucide-react';
import { useState } from 'react';

interface NavItem {
  name: string;
  href: string;
  icon: any;
  badge?: string;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  {
    name: 'Members',
    href: '/members',
    icon: Users,
    children: [
      { name: 'All Members', href: '/members', icon: Users },
      { name: 'Memberships', href: '/memberships', icon: CreditCard },
      { name: 'Progress Tracking', href: '/progress', icon: TrendingUp },
    ],
  },
  {
    name: 'Plans & Pricing',
    href: '/plans',
    icon: CreditCard,
  },
  {
    name: 'Attendance',
    href: '/attendance/logs',
    icon: Calendar,
    children: [
      { name: 'Attendance Logs', href: '/attendance/logs', icon: ClipboardList },
      { name: 'Devices', href: '/attendance/devices', icon: Activity },
    ],
  },
  {
    name: 'Workouts',
    href: '/exercises',
    icon: Dumbbell,
    children: [
      { name: 'Exercises', href: '/exercises', icon: Target },
      { name: 'Programs', href: '/workout-programs', icon: ClipboardList },
      { name: 'Workout Logs', href: '/workout-logs', icon: Activity },
    ],
  },
  {
    name: 'AI Insights',
    href: '/ai-insights',
    icon: Brain,
    badge: 'NEW',
  },
  {
    name: 'Payments',
    href: '/transactions',
    icon: DollarSign,
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: BarChart3,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name],
    );
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <div className="w-64 bg-gradient-to-b from-gray-900 to-black border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">GYM PRO</h1>
            <p className="text-xs text-gray-400">Management System</p>
          </div>
        </Link>
      </div>

      {/* Today's Activity */}
      <div className="p-4 border-b border-gray-800">
        <div className="text-xs text-gray-400 mb-2 flex items-center">
          <Activity className="w-3 h-3 mr-1" />
          TODAY'S ACTIVITY
        </div>
        <div className="flex justify-between">
          <div>
            <div className="text-2xl font-bold text-white">45</div>
            <div className="text-xs text-gray-400">Check-ins</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">12</div>
            <div className="text-xs text-gray-400">New Members</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navigation.map((item) => (
          <div key={item.name}>
            {item.children ? (
              <>
                <button
                  onClick={() => toggleExpand(item.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-orange-500/10 text-orange-500'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </div>
                  {expandedItems.includes(item.name) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                {expandedItems.includes(item.name) && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                          pathname === child.href
                            ? 'bg-orange-500/10 text-orange-500'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        }`}
                      >
                        <child.icon className="w-4 h-4 mr-2" />
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-orange-500/10 text-orange-500'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <div className="flex items-center">
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs font-semibold bg-orange-500 text-white rounded">
                    {item.badge}
                  </span>
                )}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Settings */}
      <div className="p-4 border-t border-gray-800">
        <Link
          href="/settings"
          className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <Settings className="w-5 h-5 mr-3" />
          Settings
        </Link>
      </div>
    </div>
  );
}
