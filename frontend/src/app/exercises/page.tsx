'use client';
import { useState } from 'react';
import {
  useGetExercisesQuery,
  useCreateExerciseMutation,
  useUpdateExerciseMutation,
} from '@/lib/api/exercisesApi';
import { Dumbbell, Plus, Search, Edit3, Filter, Activity, Info } from 'lucide-react';

export default function ExercisesPage() {
  const { data: exercises, isLoading } = useGetExercisesQuery({});
  const [createExercise] = useCreateExerciseMutation();
  const [updateExercise] = useUpdateExerciseMutation();

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'strength',
    equipment: '',
    instructions: '',
  });

  const categories = ['all', 'strength', 'cardio', 'flexibility', 'balance'];

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const openEditModal = (exercise: any) => {
    setSelected(exercise);
    setForm({
      name: exercise.name || '',
      description: exercise.description || '',
      category: exercise.category || 'strength',
      equipment: exercise.equipment || '',
      instructions: exercise.instructions || '',
    });
    setOpenEdit(true);
  };

  const handleCreate = async (e: any) => {
    e.preventDefault();
    await createExercise(form);
    setOpenAdd(false);
    setForm({
      name: '',
      description: '',
      category: 'strength',
      equipment: '',
      instructions: '',
    });
  };

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    await updateExercise({ id: selected.id, data: form });
    setOpenEdit(false);
  };

  const filteredExercises = exercises?.filter((exercise: any) => {
    const matchesSearch =
      exercise.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
    return matchesSearch && matchesCategory;
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
            Exercises
          </h1>
          <p className="text-gray-400 font-bold">Manage exercise library</p>
        </div>
        <button
          onClick={() => setOpenAdd(true)}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black px-6 py-3 rounded-lg hover:scale-105 transform transition-all flex items-center gap-2 shadow-lg shadow-yellow-500/50"
        >
          <Plus className="w-5 h-5" />
          Add Exercise
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          {
            label: 'Total Exercises',
            value: exercises?.length || 0,
            gradient: 'from-yellow-400 to-orange-500',
            icon: Dumbbell,
          },
          {
            label: 'Strength',
            value: exercises?.filter((e: any) => e.category === 'strength')?.length || 0,
            gradient: 'from-red-500 to-orange-500',
            icon: Activity,
          },
          {
            label: 'Cardio',
            value: exercises?.filter((e: any) => e.category === 'cardio')?.length || 0,
            gradient: 'from-green-500 to-emerald-500',
            icon: Activity,
          },
          {
            label: 'Flexibility',
            value: exercises?.filter((e: any) => e.category === 'flexibility')?.length || 0,
            gradient: 'from-blue-500 to-cyan-500',
            icon: Activity,
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
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-white flex-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-yellow-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-2 text-white outline-none focus:border-yellow-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Exercises Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises?.map((exercise: any) => (
          <div
            key={exercise.id}
            className="bg-gradient-to-br from-gray-900/50 to-black border border-yellow-500/20 rounded-xl p-6 hover:border-yellow-500/50 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-black" />
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-black ${
                  exercise.category === 'strength'
                    ? 'bg-red-500/20 text-red-400'
                    : exercise.category === 'cardio'
                      ? 'bg-green-500/20 text-green-400'
                      : exercise.category === 'flexibility'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                }`}
              >
                {exercise.category}
              </span>
            </div>

            <h3 className="text-xl font-black text-white mb-2">{exercise.name}</h3>
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
              {exercise.description || 'No description available'}
            </p>

            {exercise.equipment && (
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Info className="w-4 h-4" />
                <span>Equipment: {exercise.equipment}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={() => openEditModal(exercise)}
                className="flex-1 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {openAdd && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-500/30 rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-black text-white mb-6">Add Exercise</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <input
                name="name"
                placeholder="Exercise name"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500"
                rows={3}
              />
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500"
              >
                <option value="strength">Strength</option>
                <option value="cardio">Cardio</option>
                <option value="flexibility">Flexibility</option>
                <option value="balance">Balance</option>
              </select>
              <input
                name="equipment"
                placeholder="Equipment needed"
                value={form.equipment}
                onChange={handleChange}
                className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500"
              />
              <textarea
                name="instructions"
                placeholder="Instructions"
                value={form.instructions}
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
                  Add Exercise
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
            <h2 className="text-2xl font-black text-white mb-6">Edit Exercise</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                name="name"
                placeholder="Exercise name"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500"
                rows={3}
              />
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500"
              >
                <option value="strength">Strength</option>
                <option value="cardio">Cardio</option>
                <option value="flexibility">Flexibility</option>
                <option value="balance">Balance</option>
              </select>
              <input
                name="equipment"
                placeholder="Equipment needed"
                value={form.equipment}
                onChange={handleChange}
                className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500"
              />
              <textarea
                name="instructions"
                placeholder="Instructions"
                value={form.instructions}
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
