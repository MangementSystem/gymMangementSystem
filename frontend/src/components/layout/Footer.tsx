"use cliet"
    import { 
  Dumbbell, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Heart,
  Clock,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Award,
  ExternalLink
} from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Dashboard', link: '/' },
    { label: 'Members', link: '/members' },
    { label: 'Plans', link: '/plans' },
    { label: 'Payments', link: '/transactions' }
  ];

  const resources = [
    { label: 'Help Center', link: '/help' },
    { label: 'API Documentation', link: '/docs' },
    { label: 'System Status', link: '/status' },
    { label: 'Release Notes', link: '/releases' }
  ];

  const legal = [
    { label: 'Privacy Policy', link: '/privacy' },
    { label: 'Terms of Service', link: '/terms' },
    { label: 'Cookie Policy', link: '/cookies' },
    { label: 'GDPR Compliance', link: '/gdpr' }
  ];

  const stats = [
    { icon: Users, value: '10K+', label: 'Active Members' },
    { icon: TrendingUp, value: '99.9%', label: 'Uptime' },
    { icon: Award, value: '500+', label: 'Gyms Using' },
    { icon: Zap, value: '24/7', label: 'Support' }
  ];

  return (
    <footer className="bg-gradient-to-b from-black via-gray-900 to-black border-t-4 border-yellow-500 mt-auto">
      {/* Stats Bar */}
      <div className="border-b border-yellow-500/20 bg-gradient-to-r from-yellow-500/5 via-orange-500/5 to-red-500/5">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-yellow-500/50 transition-all group-hover:scale-110">
                      <Icon className="w-6 h-6 text-black" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-400 font-bold mt-1">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-xl shadow-yellow-500/30">
                <Dumbbell className="w-8 h-8 text-black" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  GYM PRO
                </h3>
                <p className="text-xs text-gray-400 font-bold">Management System</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm font-medium leading-relaxed mb-6">
              The ultimate gym management solution with AI-powered insights, real-time attendance tracking, and comprehensive member analytics.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-400 hover:text-yellow-400 transition-colors group">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-yellow-500/20 transition-all">
                  <Mail className="w-4 h-4 text-yellow-400" />
                </div>
                <span className="font-medium">support@gympro.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400 hover:text-orange-400 transition-colors group">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-orange-500/20 transition-all">
                  <Phone className="w-4 h-4 text-orange-400" />
                </div>
                <span className="font-medium">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400 hover:text-red-400 transition-colors group">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-red-500/20 transition-all">
                  <MapPin className="w-4 h-4 text-red-400" />
                </div>
                <span className="font-medium">123 Fitness St, Gym City</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex items-center gap-3 mt-6">
              <button className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-br hover:from-yellow-400 hover:to-orange-500 rounded-lg flex items-center justify-center transition-all group shadow-lg hover:shadow-yellow-500/50 transform hover:scale-110">
                <Facebook className="w-5 h-5 text-yellow-400 group-hover:text-black" />
              </button>
              <button className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-br hover:from-orange-400 hover:to-red-500 rounded-lg flex items-center justify-center transition-all group shadow-lg hover:shadow-orange-500/50 transform hover:scale-110">
                <Twitter className="w-5 h-5 text-orange-400 group-hover:text-black" />
              </button>
              <button className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-br hover:from-red-400 hover:to-yellow-500 rounded-lg flex items-center justify-center transition-all group shadow-lg hover:shadow-red-500/50 transform hover:scale-110">
                <Instagram className="w-5 h-5 text-red-400 group-hover:text-black" />
              </button>
              <button className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-br hover:from-yellow-500 hover:to-orange-400 rounded-lg flex items-center justify-center transition-all group shadow-lg hover:shadow-yellow-500/50 transform hover:scale-110">
                <Linkedin className="w-5 h-5 text-yellow-400 group-hover:text-black" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-yellow-400 font-black text-sm uppercase mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full"></div>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.link}
                    className="text-gray-400 hover:text-yellow-400 text-sm font-medium flex items-center gap-2 group transition-all"
                  >
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full group-hover:w-3 transition-all"></div>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-orange-400 font-black text-sm uppercase mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-orange-400 to-red-500 rounded-full"></div>
              Resources
            </h4>
            <ul className="space-y-3">
              {resources.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.link}
                    className="text-gray-400 hover:text-orange-400 text-sm font-medium flex items-center gap-2 group transition-all"
                  >
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full group-hover:w-3 transition-all"></div>
                    {link.label}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-red-400 font-black text-sm uppercase mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-red-400 to-yellow-500 rounded-full"></div>
              Legal
            </h4>
            <ul className="space-y-3">
              {legal.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.link}
                    className="text-gray-400 hover:text-red-400 text-sm font-medium flex items-center gap-2 group transition-all"
                  >
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full group-hover:w-3 transition-all"></div>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 p-6 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 rounded-xl border border-yellow-500/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h4 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-2">
                Stay Updated with GYM PRO
              </h4>
              <p className="text-gray-400 text-sm font-medium">
                Get the latest features, updates, and fitness insights delivered to your inbox
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 text-sm font-medium focus:outline-none focus:border-yellow-500 transition-all"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-black rounded-lg transition-all shadow-lg hover:shadow-yellow-500/50 transform hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-yellow-500/20 bg-black/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
              <span>© {currentYear} GYM PRO. All rights reserved.</span>
              <span className="hidden md:inline">|</span>
              <span className="flex items-center gap-1">
                Made with <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" /> for Fitness
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-400 font-medium">
                Secured & GDPR Compliant
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};