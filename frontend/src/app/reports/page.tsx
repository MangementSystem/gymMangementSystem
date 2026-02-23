'use client';
import { useState } from 'react';
import { useGetTransactionsQuery, useGetFinancialReportQuery } from '@/lib/api/transactionsApi';
import { useGetAttendanceLogsQuery } from '@/lib/api/attendanceApi';
import { useGetWorkoutLogsQuery } from '@/lib/api/workoutLogsApi';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { addNotification, selectCurrentOrganization } from '@/lib/redux/slices/uiSlice';
import {
  BarChart3,
  DollarSign,
  Users,
  Activity,
  Calendar,
  TrendingUp,
  Download,
  FileText,
} from 'lucide-react';

export default function ReportsPage() {
  const dispatch = useAppDispatch();
  const currentOrganization = useAppSelector(selectCurrentOrganization);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const { data: transactions } = useGetTransactionsQuery({
    organizationId: currentOrganization || undefined,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  const { data: attendanceLogs } = useGetAttendanceLogsQuery({
    organizationId: currentOrganization || undefined,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  const { data: workoutLogs } = useGetWorkoutLogsQuery({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  const { data: financialReport } = useGetFinancialReportQuery(
    {
      organizationId: currentOrganization || 0,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    },
    { skip: !currentOrganization },
  );

  const isExpenseTransaction = (transaction: any) =>
    transaction.type === 'expense' ||
    transaction.type === 'refund' ||
    transaction.category === 'expense' ||
    Number(transaction.amount) < 0;

  const totalRevenue =
    financialReport?.totalRevenue ??
    transactions?.reduce(
      (sum: number, transaction: any) =>
        !isExpenseTransaction(transaction) ? sum + Math.abs(Number(transaction.amount)) : sum,
      0,
    ) ??
    0;

  const totalExpenses =
    financialReport?.totalExpenses ??
    transactions?.reduce(
      (sum: number, transaction: any) =>
        isExpenseTransaction(transaction) ? sum + Math.abs(Number(transaction.amount)) : sum,
      0,
    ) ??
    0;

  const uniqueAttendees = new Set(attendanceLogs?.map((log: any) => log.member?.id)).size;

  const handleExportReport = () => {
    const rows: string[][] = [
      ['Metric', 'Value'],
      ['Start Date', dateRange.startDate],
      ['End Date', dateRange.endDate],
      ['Total Revenue', totalRevenue.toFixed(2)],
      ['Total Expenses', totalExpenses.toFixed(2)],
      ['Net Income', (totalRevenue - totalExpenses).toFixed(2)],
      ['Total Transactions', String(transactions?.length || 0)],
      ['Total Check-ins', String(attendanceLogs?.length || 0)],
      ['Unique Attendees', String(uniqueAttendees)],
      ['Workout Sessions', String(workoutLogs?.length || 0)],
    ];

    const transactionRows: string[][] =
      transactions?.map((transaction: any) => [
        new Date(transaction.created_at).toISOString(),
        `${transaction.member?.first_name || ''} ${transaction.member?.last_name || ''}`.trim(),
        transaction.type || '',
        transaction.category || '',
        String(transaction.amount),
      ]) || [];

    if (transactionRows.length > 0) {
      rows.push(['', '']);
      rows.push(['Transaction Date', 'Member', 'Type', 'Category', 'Amount']);
      rows.push(...transactionRows);
    }

    const csv = rows
      .map((line) => line.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gym-report-${dateRange.startDate}-to-${dateRange.endDate}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    dispatch(addNotification({ type: 'success', message: 'Report exported' }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-2">
            Reports & Analytics
          </h1>
          <p className="text-gray-400 font-bold">Comprehensive gym performance insights</p>
        </div>
        <button
          onClick={handleExportReport}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black px-6 py-3 rounded-lg hover:scale-105 transform transition-all flex items-center gap-2 shadow-lg shadow-yellow-500/50"
        >
          <Download className="w-5 h-5" />
          Export Report
        </button>
      </div>

      {/* Date Range Filter */}
      <div className="bg-gradient-to-br from-gray-900/50 to-black border border-yellow-500/20 rounded-xl p-4 mb-8">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-yellow-400" />
            <span className="text-gray-400 font-bold">Date Range:</span>
          </div>
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            className="bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-2 text-white outline-none focus:border-yellow-500"
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            className="bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-2 text-white outline-none focus:border-yellow-500"
          />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            label: 'Total Revenue',
            value: `$${totalRevenue.toFixed(2)}`,
            change: '+12%',
            gradient: 'from-green-500 to-emerald-500',
            icon: DollarSign,
          },
          {
            label: 'Net Income',
            value: `$${(totalRevenue - totalExpenses).toFixed(2)}`,
            change: '+8%',
            gradient: 'from-yellow-400 to-orange-500',
            icon: TrendingUp,
          },
          {
            label: 'Total Check-ins',
            value: attendanceLogs?.length || 0,
            change: '+15%',
            gradient: 'from-blue-500 to-cyan-500',
            icon: Activity,
          },
          {
            label: 'Active Members',
            value: uniqueAttendees,
            change: '+5%',
            gradient: 'from-purple-500 to-pink-500',
            icon: Users,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-gradient-to-br from-gray-900/50 to-black border border-yellow-500/20 rounded-xl p-6 hover:border-yellow-500/50 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}
              >
                <stat.icon className="w-6 h-6 text-black" />
              </div>
              <span className="text-green-400 text-sm font-black">{stat.change}</span>
            </div>
            <p className="text-gray-400 text-sm font-bold mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-gray-900/50 to-black border border-yellow-500/20 rounded-xl p-6">
          <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-yellow-400" />
            Financial Summary
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Revenue</p>
                  <p className="text-xl font-black text-white">${totalRevenue.toFixed(2)}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-lg border border-red-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Expenses</p>
                  <p className="text-xl font-black text-white">${totalExpenses.toFixed(2)}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Net Income</p>
                  <p className="text-xl font-black text-white">
                    ${(totalRevenue - totalExpenses).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900/50 to-black border border-yellow-500/20 rounded-xl p-6">
          <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
            <Activity className="w-6 h-6 text-yellow-400" />
            Activity Overview
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Unique Attendees</p>
                  <p className="text-xl font-black text-white">{uniqueAttendees}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Workout Sessions</p>
                  <p className="text-xl font-black text-white">{workoutLogs?.length || 0}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Avg. Daily Check-ins</p>
                  <p className="text-xl font-black text-white">
                    {attendanceLogs?.length ? Math.round(attendanceLogs.length / 30) : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-gradient-to-br from-gray-900/50 to-black border border-yellow-500/20 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-yellow-500/20">
          <h2 className="text-xl font-black text-white">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-yellow-500/10">
              <tr>
                <th className="text-left text-yellow-400 font-black py-4 px-6">Date</th>
                <th className="text-left text-yellow-400 font-black py-4 px-6">Member</th>
                <th className="text-left text-yellow-400 font-black py-4 px-6">Type</th>
                <th className="text-left text-yellow-400 font-black py-4 px-6">Category</th>
                <th className="text-right text-yellow-400 font-black py-4 px-6">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions?.slice(0, 10).map((transaction: any) => (
                <tr
                  key={transaction.id}
                  className="border-b border-yellow-500/10 hover:bg-yellow-500/5 transition-all"
                >
                  <td className="py-4 px-6 text-gray-300">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-white font-bold">
                    {transaction.member?.first_name} {transaction.member?.last_name}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black ${
                        !isExpenseTransaction(transaction)
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {!isExpenseTransaction(transaction) ? 'income' : 'expense'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-400">{transaction.category}</td>
                  <td className="py-4 px-6 text-right">
                    <span
                      className={`font-black ${
                        !isExpenseTransaction(transaction) ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {!isExpenseTransaction(transaction) ? '+' : '-'}$
                      {Number(transaction.amount).toFixed(2)}
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
