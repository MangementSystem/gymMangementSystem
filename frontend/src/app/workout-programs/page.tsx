"use client";
import { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  Dumbbell,
  Target,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { useGetWorkoutProgramsQuery, useDeleteWorkoutProgramMutation } from '@/lib/api/workoutProgramsApi';
import { useAppDispatch } from '@/lib/redux/hooks';
import { addNotification } from '@/lib/redux/slices/uiSlice';

export default function WorkoutProgramsPage() {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGoal, setFilterGoal] = useState('all');

  const { data: programs, isLoading } = useGetWorkoutProgramsQuery({});
  const [deleteProgram] = useDeleteWorkoutProgramMutation();

  const filteredPrograms = programs?.filter(program => {
    const matchesSearch = program.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGoal = filterGoal === 'all' || program.goal?.toLowerCase() === filterGoal;
    return matchesSearch && matchesGoal;
  });

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Delete program "${name}"?`)) {
      try {
        await deleteProgram(id).unwrap();
        dispatch(addNotification({ type: 'success', message: 'Program deleted' }));
      } catch {
        dispatch(addNotification({ type: 'error', message: 'Failed to delete' }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-8">
    
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-2">
            Workout Programs
          </h1>
          <p className="text-gray-400 font-bold">Create and manage workout programs</p>
        </div>
        <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black px-6 py-3 rounded-lg hover:scale-105 transform transition-all flex items-center gap-2 shadow-lg shadow-yellow-500/50">
          <Plus className="w-5 h-5" />
          Create Program
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Programs', value: programs?.length || 0, gradient: 'from-yellow-400 to-orange-500', icon: BookOpen },
          { label: 'Active Members', value: 156, gradient: 'from-orange-500 to-red-500', icon: Dumbbell },
          { label: 'Avg Completion', value: '78%', gradient: 'from-yellow-500 to-red-500', icon: TrendingUp },
          { label: 'This Week', value: 23, gradient: 'from-red-400 to-orange-400', icon: Calendar }
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`bg-gradient-to-br ${stat.gradient} p-6 rounded-xl shadow-lg`}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-black/70 text-sm font-black">{stat.label}</p>
                <Icon className="w-5 h-5 text-black/70" />
              </div>
              <p className="text-4xl font-black text-black">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-br from-gray-900/50 to-black border-2 border-yellow-500/20 rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search programs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border border-yellow-500/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-yellow-500/50 focus:outline-none font-bold"
            />
          </div>
          <select 
            value={filterGoal}
            onChange={(e) => setFilterGoal(e.target.value)}
            className="bg-gray-800 border border-yellow-500/20 rounded-lg px-4 py-3 text-white focus:border-yellow-500/50 focus:outline-none font-bold"
          >
            <option value="all">All Goals</option>
            <option value="strength">Strength</option>
            <option value="endurance">Endurance</option>
            <option value="weight loss">Weight Loss</option>
            <option value="muscle gain">Muscle Gain</option>
          </select>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : (
          filteredPrograms?.map((program) => (
            <div 
              key={program.id}
              className="bg-gradient-to-br from-gray-900/50 to-black border-2 border-yellow-500/20 rounded-xl p-6 hover:border-yellow-500/50 transition-all hover:scale-105 transform"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                  <BookOpen className="w-6 h-6 text-black" />
                </div>
                <div className="flex gap-2">
                  <button className="p-2 bg-blue-500/20 border border-blue-500/50 rounded-lg hover:bg-blue-500/30 transition-all">
                    <Eye className="w-4 h-4 text-blue-400" />
                  </button>
                  <button className="p-2 bg-yellow-500/20 border border-yellow-500/50 rounded-lg hover:bg-yellow-500/30 transition-all">
                    <Edit className="w-4 h-4 text-yellow-400" />
                  </button>
                  <button 
                    onClick={() => handleDelete(program.id, program.name)}
                    className="p-2 bg-red-500/20 border border-red-500/50 rounded-lg hover:bg-red-500/30 transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-black text-white mb-2">{program.name}</h3>
              
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-400 font-bold">{program.goal || 'General Fitness'}</span>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Dumbbell className="w-4 h-4 text-orange-400" />
                <span className="text-sm text-gray-400 font-bold">
                  {program.exercises?.length || 0} Exercises
                </span>
              </div>

              <div className="border-t border-yellow-500/20 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-bold">
                    Created {new Date(program.created_at).toLocaleDateString()}
                  </span>
                  <span className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/50 text-green-400 text-xs font-black rounded-full">
                    Active
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {filteredPrograms?.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 font-bold">No programs found</p>
        </div>
      )}
    </div>
  );
}