'use client';
import { useState } from 'react';
import { useGetProgressQuery, useCreateProgressMutation } from '@/lib/api/progressApi';
import { useGetMembersQuery } from '@/lib/api/membersApi';
import { TrendingUp, Plus, Calendar, User, Activity, Scale, Target } from 'lucide-react';
import { useAppSelector } from '@/lib/redux/hooks';
import { selectCurrentOrganization } from '@/lib/redux/slices/uiSlice';

export default function ProgressPage() {
  const currentOrganization = useAppSelector(selectCurrentOrganization);
  const { data: members } = useGetMembersQuery({
    organizationId: currentOrganization || undefined,
  });
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const { data: progressData, isLoading } = useGetProgressQuery(
    { memberId: selectedMember || 0 },
    { skip: !selectedMember },
  );
  const [createProgress] = useCreateProgressMutation();

  const [openAdd, setOpenAdd] = useState(false);
  const [form, setForm] = useState({
    memberId: 0,
    date: new Date().toISOString().split('T')[0],
    weight: '',
    body_fat: '',
    muscle_mass: '',
    ai_feedback: '',
  });

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e: any) => {
    e.preventDefault();
    await createProgress({
      memberId: form.memberId,
      date: form.date,
      weight: form.weight ? parseFloat(form.weight) : undefined,
      body_fat: form.body_fat ? parseFloat(form.body_fat) : undefined,
      muscle_mass: form.muscle_mass ? parseFloat(form.muscle_mass) : undefined,
      ai_feedback: form.ai_feedback,
    });
    setOpenAdd(false);
    setForm({
      memberId: 0,
      date: new Date().toISOString().split('T')[0],
      weight: '',
      body_fat: '',
      muscle_mass: '',
      ai_feedback: '',
    });
  };

  const selectedMemberData = members?.find((m: any) => m.id === selectedMember);

  if (isLoading && selectedMember)
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
            Progress Tracking
          </h1>
          <p className="text-gray-400 font-bold">Monitor member fitness progress</p>
        </div>
        {selectedMember && (
          <button
            onClick={() => {
              setForm({ ...form, memberId: selectedMember });
              setOpenAdd(true);
            }}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black px-6 py-3 rounded-lg hover:scale-105 transform transition-all flex items-center gap-2 shadow-lg shadow-yellow-500/50"
          >
            <Plus className="w-5 h-5" />
            Add Entry
          </button>
        )}
      </div>

      {/* Member Selection */}
      <div className="bg-gradient-to-br from-gray-900/50 to-black border border-yellow-500/20 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-black text-white mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-yellow-400" />
          Select Member
        </h2>
        <div className="flex flex-wrap gap-3">
          {members?.map((member: any) => (
            <button
              key={member.id}
              onClick={() => setSelectedMember(member.id)}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                selectedMember === member.id
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black'
                  : 'bg-black/50 border border-yellow-500/20 text-gray-300 hover:border-yellow-500/50'
              }`}
            >
              {member.first_name} {member.last_name}
            </button>
          ))}
        </div>
      </div>

      {selectedMember && selectedMemberData && (
        <>
          {/* Member Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              {
                label: 'Total Entries',
                value: progressData?.length || 0,
                gradient: 'from-yellow-400 to-orange-500',
                icon: Activity,
              },
              {
                label: 'Latest Weight',
                value: progressData?.[0]?.weight ? `${progressData[0].weight} kg` : '-',
                gradient: 'from-blue-500 to-cyan-500',
                icon: Scale,
              },
              {
                label: 'Body Fat',
                value: progressData?.[0]?.body_fat ? `${progressData[0].body_fat}%` : '-',
                gradient: 'from-green-500 to-emerald-500',
                icon: Target,
              },
              {
                label: 'Muscle Mass',
                value: progressData?.[0]?.muscle_mass ? `${progressData[0].muscle_mass} kg` : '-',
                gradient: 'from-purple-500 to-pink-500',
                icon: TrendingUp,
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

          {/* Progress History */}
          <div className="bg-gradient-to-br from-gray-900/50 to-black border border-yellow-500/20 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-yellow-500/20">
              <h2 className="text-xl font-black text-white">Progress History</h2>
            </div>
            {progressData && progressData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-yellow-500/10">
                    <tr>
                      <th className="text-left text-yellow-400 font-black py-4 px-6">Date</th>
                      <th className="text-left text-yellow-400 font-black py-4 px-6">Weight</th>
                      <th className="text-left text-yellow-400 font-black py-4 px-6">Body Fat</th>
                      <th className="text-left text-yellow-400 font-black py-4 px-6">
                        Muscle Mass
                      </th>
                      <th className="text-left text-yellow-400 font-black py-4 px-6">
                        AI Feedback
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {progressData.map((entry: any) => (
                      <tr
                        key={entry.id}
                        className="border-b border-yellow-500/10 hover:bg-yellow-500/5 transition-all"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2 text-gray-300">
                            <Calendar className="w-4 h-4 text-yellow-400" />
                            {new Date(entry.date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-white font-bold">
                          {entry.weight ? `${entry.weight} kg` : '-'}
                        </td>
                        <td className="py-4 px-6 text-white font-bold">
                          {entry.body_fat ? `${entry.body_fat}%` : '-'}
                        </td>
                        <td className="py-4 px-6 text-white font-bold">
                          {entry.muscle_mass ? `${entry.muscle_mass} kg` : '-'}
                        </td>
                        <td className="py-4 px-6 text-gray-400 text-sm max-w-xs truncate">
                          {entry.ai_feedback || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 font-bold">No progress entries yet</p>
                <p className="text-gray-600 text-sm mt-2">
                  Start tracking by adding your first entry
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {!selectedMember && (
        <div className="flex flex-col items-center justify-center py-20">
          <User className="w-20 h-20 text-gray-600 mb-6" />
          <h2 className="text-2xl font-black text-white mb-2">Select a Member</h2>
          <p className="text-gray-400">Choose a member above to view their progress</p>
        </div>
      )}

      {/* Add Modal */}
      {openAdd && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-500/30 rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-black text-white mb-6">Add Progress Entry</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500"
                required
              />
              <input
                type="number"
                step="0.1"
                name="weight"
                placeholder="Weight (kg)"
                value={form.weight}
                onChange={handleChange}
                className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500"
              />
              <input
                type="number"
                step="0.1"
                name="body_fat"
                placeholder="Body Fat %"
                value={form.body_fat}
                onChange={handleChange}
                className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500"
              />
              <input
                type="number"
                step="0.1"
                name="muscle_mass"
                placeholder="Muscle Mass (kg)"
                value={form.muscle_mass}
                onChange={handleChange}
                className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500"
              />
              <textarea
                name="ai_feedback"
                placeholder="AI Feedback (optional)"
                value={form.ai_feedback}
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
                  Add Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
