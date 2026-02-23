'use client';
import { useState } from 'react';
import {
  useGetWorkoutLogsQuery,
  useCreateWorkoutLogMutation,
  useUpdateWorkoutLogMutation,
  useDeleteWorkoutLogMutation,
} from '@/lib/api/workoutLogsApi';
import { useGetMembersQuery } from '@/lib/api/membersApi';
import { useGetWorkoutProgramsQuery } from '@/lib/api/workoutProgramsApi';
import {
  FileText,
  Plus,
  Search,
  Calendar,
  User,
  BookOpen,
  Trash2,
  Edit3,
  TrendingUp,
} from 'lucide-react';
import { useAppSelector } from '@/lib/redux/hooks';
import { selectCurrentOrganization } from '@/lib/redux/slices/uiSlice';

export default function WorkoutLogsPage() {
  const currentOrganization = useAppSelector(selectCurrentOrganization);
  const { data: workoutLogs, isLoading } = useGetWorkoutLogsQuery({});
  const { data: members } = useGetMembersQuery({
    organizationId: currentOrganization || undefined,
  });
  const { data: programs } = useGetWorkoutProgramsQuery({});
  const [createWorkoutLog] = useCreateWorkoutLogMutation();
  const [updateWorkoutLog] = useUpdateWorkoutLogMutation();
  const [deleteWorkoutLog] = useDeleteWorkoutLogMutation();

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<number | null>(null);

  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState({
    memberId: 0,
    programId: null as number | null,
    date: new Date().toISOString().split('T')[0],
    ai_summary: '',
  });

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const openEditModal = (log: any) => {
    setSelected(log);
    setForm({
      memberId: log.member?.id || 0,
      programId: log.program?.id || null,
      date: log.date
        ? new Date(log.date).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      ai_summary: log.ai_summary || '',
    });
    setOpenEdit(true);
  };

  const handleCreate = async (e: any) => {
    e.preventDefault();
    await createWorkoutLog({
      memberId: form.memberId,
      programId: form.programId || undefined,
      date: form.date,
      ai_summary: form.ai_summary,
    });
    setOpenAdd(false);
    setForm({
      memberId: 0,
      programId: null,
      date: new Date().toISOString().split('T')[0],
      ai_summary: '',
    });
  };

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    await updateWorkoutLog({
      id: selected.id,
      data: {
        date: form.date,
        ai_summary: form.ai_summary,
      },
    });
    setOpenEdit(false);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this workout log?')) {
      await deleteWorkoutLog(id);
    }
  };

  const filteredLogs = workoutLogs?.filter((log: any) => {
    const memberName =
      `${log.member?.first_name || ''} ${log.member?.last_name || ''}`.toLowerCase();
    const matchesSearch = memberName.includes(searchTerm.toLowerCase());
    const matchesMember = selectedMember === null || log.member?.id === selectedMember;
    return matchesSearch && matchesMember;
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-2">
            Workout Logs
          </h1>
          <p className="text-gray-400 font-bold">Track member workout sessions</p>
        </div>
        <button
          onClick={() => setOpenAdd(true)}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black px-6 py-3 rounded-lg hover:scale-105 transform transition-all flex items-center gap-2 shadow-lg shadow-yellow-500/50"
        >
          <Plus className="w-5 h-5" />
          Log Workout
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          {
            label: 'Total Logs',
            value: workoutLogs?.length || 0,
            gradient: 'from-yellow-400 to-orange-500',
            icon: FileText,
          },
          {
            label: 'This Week',
            value:
              workoutLogs?.filter((log: any) => {
                const logDate = new Date(log.date);
                const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                return logDate >= weekAgo;
              })?.length || 0,
            gradient: 'from-green-500 to-emerald-500',
            icon: TrendingUp,
          },
          {
            label: 'With Programs',
            value: workoutLogs?.filter((log: any) => log.program)?.length || 0,
            gradient: 'from-blue-500 to-cyan-500',
            icon: BookOpen,
          },
          {
            label: 'Active Members',
            value: new Set(workoutLogs?.map((log: any) => log.member?.id)).size || 0,
            gradient: 'from-purple-500 to-pink-500',
            icon: User,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-gradient-to-br from-gray-900/50 to-black border border-yellow-500/20 rounded-xl p-6 hover:border-yellow-500/50 transition-all"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}
              >
                <stat.icon className="w-6 h-6 text-black" />
              </div>
              <div>
                <p className="text-gray-400 text-sm font-bold">{stat.label}</p>
                <p className="text-2xl font-black text-white">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-br from-gray-900/50 to-black border border-yellow-500/20 rounded-xl p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 bg-black/50 px-4 py-2 rounded-lg border border-yellow-500/20 flex-1 max-w-md">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by member..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-white flex-1"
            />
          </div>
          <select
            value={selectedMember || ''}
            onChange={(e) => setSelectedMember(e.target.value ? +e.target.value : null)}
            className="bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-2 text-white outline-none focus:border-yellow-500"
          >
            <option value="">All Members</option>
            {members?.map((member: any) => (
              <option key={member.id} value={member.id}>
                {member.first_name} {member.last_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Workout Logs Table */}
      <div className="bg-gradient-to-br from-gray-900/50 to-black border border-yellow-500/20 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-yellow-500/10 border-b border-yellow-500/20">
              <tr>
                <th className="text-left text-yellow-400 font-black py-4 px-6">Member</th>
                <th className="text-left text-yellow-400 font-black py-4 px-6">Date</th>
                <th className="text-left text-yellow-400 font-black py-4 px-6">Program</th>
                <th className="text-left text-yellow-400 font-black py-4 px-6">Sets</th>
                <th className="text-right text-yellow-400 font-black py-4 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs?.map((log: any) => (
                <tr
                  key={log.id}
                  className="border-b border-yellow-500/10 hover:bg-yellow-500/5 transition-all"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                        <User className="w-5 h-5 text-black" />
                      </div>
                      <div>
                        <p className="font-bold text-white">
                          {log.member?.first_name} {log.member?.last_name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar className="w-4 h-4 text-yellow-400" />
                      {new Date(log.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {log.program ? (
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-500/20 text-blue-400">
                        {log.program.name}
                      </span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-white font-bold">{log.sets?.length || 0}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(log)}
                        className="p-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 rounded-lg transition-all"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(log.id)}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {openAdd && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-500/30 rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-black text-white mb-6">Log Workout</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <select
                name="memberId"
                value={form.memberId}
                onChange={handleChange}
                className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500"
                required
              >
                <option value={0}>Select Member</option>
                {members?.map((member: any) => (
                  <option key={member.id} value={member.id}>
                    {member.first_name} {member.last_name}
                  </option>
                ))}
              </select>
              <select
                name="programId"
                value={form.programId || ''}
                onChange={handleChange}
                className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500"
              >
                <option value="">No Program</option>
                {programs?.map((program: any) => (
                  <option key={program.id} value={program.id}>
                    {program.name}
                  </option>
                ))}
              </select>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500"
                required
              />
              <textarea
                name="ai_summary"
                placeholder="AI Summary (optional)"
                value={form.ai_summary}
                onChange={handleChange}
                className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500"
                rows={3}
              />
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setOpenAdd(false)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black py-3 rounded-lg hover:scale-105 transform transition-all"
                >
                  Log Workout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {openEdit && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-500/30 rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-black text-white mb-6">Edit Workout Log</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500"
                required
              />
              <textarea
                name="ai_summary"
                placeholder="AI Summary (optional)"
                value={form.ai_summary}
                onChange={handleChange}
                className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500"
                rows={3}
              />
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setOpenEdit(false)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black py-3 rounded-lg hover:scale-105 transform transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
