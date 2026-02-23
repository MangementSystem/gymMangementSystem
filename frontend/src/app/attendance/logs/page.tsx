'use client';
import { useState } from 'react';
import { Calendar, Download, UserCheck, X } from 'lucide-react';
import {
  useGetAttendanceLogsQuery,
  useCheckInMutation,
  useCheckOutMutation,
} from '@/lib/api/attendanceApi';
import { useGetMembersQuery } from '@/lib/api/membersApi';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { addNotification, selectCurrentOrganization } from '@/lib/redux/slices/uiSlice';

export default function AttendanceLogsPage() {
  const dispatch = useAppDispatch();
  const currentOrganization = useAppSelector(selectCurrentOrganization);
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });
  const [openCheckIn, setOpenCheckIn] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState('');

  const { data: logs, isLoading } = useGetAttendanceLogsQuery({
    organizationId: currentOrganization || undefined,
    startDate: dateRange.start,
    endDate: dateRange.end,
  });
  const { data: members } = useGetMembersQuery({
    organizationId: currentOrganization || undefined,
  });
  const [checkIn] = useCheckInMutation();
  const [checkOut] = useCheckOutMutation();

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId) return;
    try {
      await checkIn({ memberId: Number(selectedMemberId) }).unwrap();
      dispatch(addNotification({ type: 'success', message: 'Check-in recorded successfully' }));
      setOpenCheckIn(false);
      setSelectedMemberId('');
    } catch (err: any) {
      dispatch(
        addNotification({ type: 'error', message: err?.data?.message || 'Check-in failed' }),
      );
    }
  };

  const handleCheckOut = async (logId: number) => {
    try {
      await checkOut({ logId }).unwrap();
      dispatch(addNotification({ type: 'success', message: 'Check-out recorded' }));
    } catch {
      dispatch(addNotification({ type: 'error', message: 'Check-out failed' }));
    }
  };

  const handleExport = () => {
    if (!logs || logs.length === 0) {
      dispatch(addNotification({ type: 'warning', message: 'No attendance data to export' }));
      return;
    }

    const header = ['Log ID', 'Member', 'Check In', 'Check Out', 'Duration Minutes', 'Status'];
    const rows = logs.map((log: any) => {
      const checkInTime = log.check_in ? new Date(log.check_in) : null;
      const checkOutTime = log.check_out ? new Date(log.check_out) : null;
      const durationMinutes =
        checkInTime && checkOutTime
          ? Math.floor((checkOutTime.getTime() - checkInTime.getTime()) / 60000)
          : '';

      return [
        log.id,
        `${log.member?.first_name || ''} ${log.member?.last_name || ''}`.trim(),
        checkInTime ? checkInTime.toISOString() : '',
        checkOutTime ? checkOutTime.toISOString() : '',
        durationMinutes,
        checkOutTime ? 'completed' : 'active',
      ];
    });

    const csv = [header, ...rows]
      .map((line) => line.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attendance-logs-${dateRange.start}-to-${dateRange.end}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    dispatch(addNotification({ type: 'success', message: 'Attendance report exported' }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-2">
            Attendance Logs
          </h1>
          <p className="text-gray-400 font-bold">Track member check-ins and check-outs</p>
        </div>
        <button
          onClick={() => setOpenCheckIn(true)}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black px-6 py-3 rounded-lg hover:scale-105 transform transition-all flex items-center gap-2 shadow-lg shadow-yellow-500/50"
        >
          <UserCheck className="w-5 h-5" />
          Check In
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          {
            label: "Today's Check-ins",
            value: logs?.filter((l) => l.check_in)?.length || 0,
            gradient: 'from-yellow-400 to-orange-500',
          },
          {
            label: 'Currently In Gym',
            value: logs?.filter((l) => l.check_in && !l.check_out)?.length || 0,
            gradient: 'from-orange-500 to-red-500',
          },
          {
            label: 'Completed Sessions',
            value: logs?.filter((l) => l.check_out)?.length || 0,
            gradient: 'from-yellow-500 to-red-500',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`bg-gradient-to-br ${stat.gradient} p-6 rounded-xl shadow-lg`}
          >
            <p className="text-black/70 text-sm font-black mb-1">{stat.label}</p>
            <p className="text-4xl font-black text-black">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Date Filter */}
      <div className="bg-gradient-to-br from-gray-900/50 to-black border-2 border-yellow-500/20 rounded-xl p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <Calendar className="w-5 h-5 text-yellow-400" />
          <span className="text-gray-400 font-bold">Date Range:</span>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="bg-gray-800 border border-yellow-500/20 rounded-lg px-4 py-3 text-white focus:border-yellow-500/50 focus:outline-none font-bold"
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="bg-gray-800 border border-yellow-500/20 rounded-lg px-4 py-3 text-white focus:border-yellow-500/50 focus:outline-none font-bold"
          />
          <button
            onClick={handleExport}
            className="ml-auto bg-gray-800 border border-yellow-500/20 rounded-lg px-6 py-3 text-yellow-400 hover:border-yellow-500/50 transition-all font-black flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gradient-to-br from-gray-900/50 to-black border-2 border-yellow-500/20 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-b-2 border-yellow-500/20">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-yellow-400 uppercase">
                    Member
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-yellow-400 uppercase">
                    Check-in
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-yellow-400 uppercase">
                    Check-out
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-yellow-400 uppercase">
                    Duration
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-yellow-400 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-yellow-400 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-yellow-500/10">
                {logs && logs.length > 0 ? (
                  logs.map((log: any) => (
                    <tr key={log.id} className="hover:bg-yellow-500/5 transition-all">
                      <td className="px-6 py-4 font-black text-white">
                        {log.member?.first_name} {log.member?.last_name}
                      </td>
                      <td className="px-6 py-4 text-gray-300 font-medium">
                        {log.check_in ? new Date(log.check_in).toLocaleTimeString() : '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-300 font-medium">
                        {log.check_out ? new Date(log.check_out).toLocaleTimeString() : '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-300 font-medium">
                        {log.check_in && log.check_out
                          ? `${Math.floor((new Date(log.check_out).getTime() - new Date(log.check_in).getTime()) / 60000)} min`
                          : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-xs font-black rounded-full ${log.check_out ? 'bg-gray-500/20 border border-gray-500/50 text-gray-400' : 'bg-green-500/20 border border-green-500/50 text-green-400'}`}
                        >
                          {log.check_out ? 'Completed' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {!log.check_out && (
                          <button
                            onClick={() => handleCheckOut(log.id)}
                            className="px-3 py-2 bg-orange-500/20 border border-orange-500/50 text-orange-400 text-xs font-black rounded-lg hover:bg-orange-500/30 transition-all"
                          >
                            Check Out
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <UserCheck className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p className="font-bold">No attendance records for this date range.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Check-In Modal */}
      {openCheckIn && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-500/30 rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-white">Check In Member</h2>
              <button
                onClick={() => setOpenCheckIn(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCheckIn} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1">
                  Select Member *
                </label>
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500"
                  required
                >
                  <option value="">Choose a member...</option>
                  {members?.map((m: any) => (
                    <option key={m.id} value={m.id}>
                      {m.first_name} {m.last_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setOpenCheckIn(false)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black py-3 rounded-lg hover:scale-105 transform transition-all"
                >
                  Check In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
