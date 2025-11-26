"use client";
import { useState } from 'react';
import { Package, Plus, Edit, Trash2, DollarSign, Calendar } from 'lucide-react';
import { useGetPlansQuery, useDeletePlanMutation } from '@/lib/api/plansApi';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { addNotification, selectCurrentOrganization } from '@/lib/redux/slices/uiSlice';

export function PlansPage() {
  const dispatch = useAppDispatch();
  const currentOrganization = useAppSelector(selectCurrentOrganization);
  const { data: plans, isLoading } = useGetPlansQuery({ organizationId: currentOrganization || undefined });
  const [deletePlan] = useDeletePlanMutation();

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Delete plan "${name}"?`)) {
      try {
        await deletePlan(id).unwrap();
        dispatch(addNotification({ type: 'success', message: 'Plan deleted' }));
      } catch { dispatch(addNotification({ type: 'error', message: 'Failed to delete' })); }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-2">Plans & Pricing</h1>
          <p className="text-gray-400 font-bold">Manage membership plans</p>
        </div>
        <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black px-6 py-3 rounded-lg hover:scale-105 transform transition-all flex items-center gap-2 shadow-lg shadow-yellow-500/50">
          <Plus className="w-5 h-5" />Add Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full p-8 text-center"><div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div></div>
        ) : (
          plans?.map((plan) => (
            <div key={plan.id} className="bg-gradient-to-br from-gray-900/50 to-black border-2 border-yellow-500/20 rounded-xl p-6 hover:border-yellow-500/50 transition-all hover:scale-105 transform">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-4 shadow-lg">
                <Package className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">{plan.name}</h3>
              <p className="text-gray-400 text-sm font-medium mb-4">{plan.description || 'No description'}</p>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">${plan.price}</span>
                <span className="text-gray-500 font-bold">/ {plan.duration_days} days</span>
              </div>
              <div className="flex gap-2 border-t border-yellow-500/20 pt-4">
                <button className="flex-1 bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 font-black py-2 rounded-lg hover:bg-yellow-500/30 transition-all flex items-center justify-center gap-2">
                  <Edit className="w-4 h-4" />Edit
                </button>
                <button onClick={() => handleDelete(plan.id, plan.name)} className="flex-1 bg-red-500/20 border border-red-500/50 text-red-400 font-black py-2 rounded-lg hover:bg-red-500/30 transition-all flex items-center justify-center gap-2">
                  <Trash2 className="w-4 h-4" />Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}