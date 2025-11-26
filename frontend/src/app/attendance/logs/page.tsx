"use client";
import { useState } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, Filter, Download } from 'lucide-react';
import { useGetAttendanceLogsQuery } from '@/lib/api/attendanceApi';

export function AttendanceLogsPage() {
  const [dateRange, setDateRange] = useState({ start: new Date().toISOString().split('T')[0], end: new Date().toISOString().split('T')[0] });
  const { data: logs, isLoading } = useGetAttendanceLogsQuery({ startDate: dateRange.start, endDate: dateRange.end });

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-2">Attendance Logs</h1>
        <p className="text-gray-400 font-bold">Track member check-ins and check-outs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: "Today's Check-ins", value: logs?.filter(l => l.check_in)?.length || 0, gradient: 'from-yellow-400 to-orange-500' },
          { label: 'Currently In Gym', value: logs?.filter(l => l.check_in && !l.check_out)?.length || 0, gradient: 'from-orange-500 to-red-500' },
          { label: 'Avg Daily', value: '127', gradient: 'from-yellow-500 to-red-500' }
        ].map((stat) => (
          <div key={stat.label} className={`bg-gradient-to-br ${stat.gradient} p-6 rounded-xl shadow-lg`}>
            <p className="text-black/70 text-sm font-black mb-1">{stat.label}</p>
            <p className="text-4xl font-black text-black">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-gray-900/50 to-black border-2 border-yellow-500/20 rounded-xl p-6 mb-6">
        <div className="flex gap-4">
          <input type="date" value={dateRange.start} onChange={(e) => setDateRange({...dateRange, start: e.target.value})} className="bg-gray-800 border border-yellow-500/20 rounded-lg px-4 py-3 text-white focus:border-yellow-500/50 focus:outline-none font-bold" />
          <input type="date" value={dateRange.end} onChange={(e) => setDateRange({...dateRange, end: e.target.value})} className="bg-gray-800 border border-yellow-500/20 rounded-lg px-4 py-3 text-white focus:border-yellow-500/50 focus:outline-none font-bold" />
          <button className="bg-gray-800 border border-yellow-500/20 rounded-lg px-6 py-3 text-yellow-400 hover:border-yellow-500/50 transition-all font-black flex items-center gap-2">
            <Download className="w-5 h-5" />Export
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-gray-900/50 to-black border-2 border-yellow-500/20 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-b-2 border-yellow-500/20">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-yellow-400 uppercase">Member</th>
                <th className="px-6 py-4 text-left text-xs font-black text-yellow-400 uppercase">Check-in</th>
                <th className="px-6 py-4 text-left text-xs font-black text-yellow-400 uppercase">Check-out</th>
                <th className="px-6 py-4 text-left text-xs font-black text-yellow-400 uppercase">Duration</th>
                <th className="px-6 py-4 text-left text-xs font-black text-yellow-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-yellow-500/10">
              {logs?.map((log) => (
                <tr key={log.id} className="hover:bg-yellow-500/5 transition-all">
                  <td className="px-6 py-4 font-black text-white">{log.member?.first_name} {log.member?.last_name}</td>
                  <td className="px-6 py-4 text-gray-300 font-medium">{log.check_in ? new Date(log.check_in).toLocaleTimeString() : '-'}</td>
                  <td className="px-6 py-4 text-gray-300 font-medium">{log.check_out ? new Date(log.check_out).toLocaleTimeString() : '-'}</td>
                  <td className="px-6 py-4 text-gray-300 font-medium">
                    {log.check_in && log.check_out ? `${Math.floor((new Date(log.check_out).getTime() - new Date(log.check_in).getTime()) / 60000)} min` : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-black rounded-full ${log.check_out ? 'bg-gray-500/20 border border-gray-500/50 text-gray-400' : 'bg-green-500/20 border border-green-500/50 text-green-400'}`}>
                      {log.check_out ? 'Completed' : 'Active'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
