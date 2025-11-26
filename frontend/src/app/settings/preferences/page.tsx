"use client";
import { useState } from 'react';
import { Sliders, Moon, Sun, Bell, Globe, Save } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { selectTheme, setTheme, addNotification } from '@/lib/redux/slices/uiSlice';

export default function PreferencesPage() {
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector(selectTheme);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('en');

  const handleSave = () => {
    dispatch(addNotification({ type: 'success', message: 'Preferences saved successfully' }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-2">
          Preferences
        </h1>
        <p className="text-gray-400 font-bold">Customize your experience</p>
      </div>

      <div className="max-w-4xl">
        <div className="bg-gradient-to-br from-gray-900/50 to-black border-2 border-yellow-500/20 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
              <Sliders className="w-8 h-8 text-black" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">User Preferences</h2>
              <p className="text-gray-400 font-medium">Personalize your settings</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-gray-800/50 rounded-lg border border-yellow-500/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {currentTheme === 'dark' ? <Moon className="w-5 h-5 text-yellow-400" /> : <Sun className="w-5 h-5 text-yellow-400" />}
                  <div>
                    <p className="font-black text-white">Theme</p>
                    <p className="text-sm text-gray-400 font-medium">Choose your color scheme</p>
                  </div>
                </div>
                <select 
                  value={currentTheme}
                  onChange={(e) => dispatch(setTheme(e.target.value as 'light' | 'dark'))}
                  className="bg-gray-800 border border-yellow-500/20 rounded-lg px-4 py-2 text-white focus:border-yellow-500/50 focus:outline-none font-bold"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>
            </div>

            <div className="p-6 bg-gray-800/50 rounded-lg border border-yellow-500/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="font-black text-white">Notifications</p>
                    <p className="text-sm text-gray-400 font-medium">Receive updates and alerts</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-yellow-400 peer-checked:to-orange-500"></div>
                </label>
              </div>
            </div>

            <div className="p-6 bg-gray-800/50 rounded-lg border border-yellow-500/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="font-black text-white">Language</p>
                    <p className="text-sm text-gray-400 font-medium">Select your preferred language</p>
                  </div>
                </div>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-gray-800 border border-yellow-500/20 rounded-lg px-4 py-2 text-white focus:border-yellow-500/50 focus:outline-none font-bold"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-yellow-500/20">
              <button 
                onClick={handleSave}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black px-8 py-3 rounded-lg hover:scale-105 transform transition-all flex items-center gap-2 shadow-lg"
              >
                <Save className="w-5 h-5" />Save Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}