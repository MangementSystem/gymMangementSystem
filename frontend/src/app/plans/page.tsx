'use client';
import { useState } from 'react';
import { Package, Plus, Edit, Trash2, X } from 'lucide-react';
import {
  useGetPlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
} from '@/lib/api/plansApi';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { addNotification, selectCurrentOrganization } from '@/lib/redux/slices/uiSlice';

const emptyForm = { name: '', price: '', duration_days: '', description: '' };

export default function PlansPage() {
  const dispatch = useAppDispatch();
  const currentOrganization = useAppSelector(selectCurrentOrganization);
  const { data: plans, isLoading } = useGetPlansQuery({
    organizationId: currentOrganization || undefined,
  });
  const [createPlan] = useCreatePlanMutation();
  const [updatePlan] = useUpdatePlanMutation();
  const [deletePlan] = useDeletePlanMutation();

  const [openAdd, setOpenAdd] = useState(false);
  const [editTarget, setEditTarget] = useState<any>(null);
  const [form, setForm] = useState<typeof emptyForm>({ ...emptyForm });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setForm({ ...emptyForm });
    setEditTarget(null);
    setOpenAdd(true);
  };

  const openEditModal = (plan: any) => {
    setForm({
      name: plan.name,
      price: String(plan.price),
      duration_days: String(plan.duration_days),
      description: plan.description || '',
    });
    setEditTarget(plan);
    setOpenAdd(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const basePayload = {
      name: form.name,
      price: parseFloat(form.price),
      duration_days: parseInt(form.duration_days),
      description: form.description || undefined,
    };
    try {
      if (editTarget) {
        await updatePlan({ id: editTarget.id, data: basePayload }).unwrap();
        dispatch(addNotification({ type: 'success', message: 'Plan updated successfully' }));
      } else {
        await createPlan({
          ...basePayload,
          organizationId: currentOrganization || undefined,
        }).unwrap();
        dispatch(addNotification({ type: 'success', message: 'Plan created successfully' }));
      }
      setOpenAdd(false);
      setForm({ ...emptyForm });
      setEditTarget(null);
    } catch (err: any) {
      dispatch(
        addNotification({ type: 'error', message: err?.data?.message || 'Operation failed' }),
      );
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Delete plan "${name}"?`)) {
      try {
        await deletePlan(id).unwrap();
        dispatch(addNotification({ type: 'success', message: 'Plan deleted' }));
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
            Plans &amp; Pricing
          </h1>
          <p className="text-gray-400 font-bold">Manage membership plans</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black px-6 py-3 rounded-lg hover:scale-105 transform transition-all flex items-center gap-2 shadow-lg shadow-yellow-500/50"
        >
          <Plus className="w-5 h-5" />
          Add Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : plans && plans.length > 0 ? (
          plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-gradient-to-br from-gray-900/50 to-black border-2 border-yellow-500/20 rounded-xl p-6 hover:border-yellow-500/50 transition-all hover:scale-105 transform"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-4 shadow-lg">
                <Package className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">{plan.name}</h3>
              <p className="text-gray-400 text-sm font-medium mb-4">
                {plan.description || 'No description'}
              </p>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  ${plan.price}
                </span>
                <span className="text-gray-500 font-bold">/ {plan.duration_days} days</span>
              </div>
              <div className="flex gap-2 border-t border-yellow-500/20 pt-4">
                <button
                  onClick={() => openEditModal(plan)}
                  className="flex-1 bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 font-black py-2 rounded-lg hover:bg-yellow-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(plan.id, plan.name)}
                  className="flex-1 bg-red-500/20 border border-red-500/50 text-red-400 font-black py-2 rounded-lg hover:bg-red-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <Package className="w-20 h-20 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-black text-gray-400 mb-2">No Plans Yet</h3>
            <p className="text-gray-500 mb-6">Create your first membership plan to get started</p>
            <button
              onClick={openAddModal}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black px-6 py-3 rounded-lg hover:scale-105 transform transition-all"
            >
              Add First Plan
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {openAdd && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-500/30 rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-white">
                {editTarget ? 'Edit Plan' : 'Add New Plan'}
              </h2>
              <button onClick={() => setOpenAdd(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1">Plan Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Premium Monthly"
                  className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-1">Price ($) *</label>
                  <input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="49.99"
                    className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-1">
                    Duration (days) *
                  </label>
                  <input
                    name="duration_days"
                    type="number"
                    value={form.duration_days}
                    onChange={handleChange}
                    placeholder="30"
                    className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500"
                    required
                    min="1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe what's included in this plan..."
                  rows={3}
                  className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500"
                />
              </div>
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
                  {editTarget ? 'Update Plan' : 'Create Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
