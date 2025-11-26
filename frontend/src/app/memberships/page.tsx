"use client";
import { useState } from 'react';
import { CreditCard, Plus, Search, Clock, CheckCircle, XCircle, AlertCircle, DollarSign, Calendar } from 'lucide-react';
import { useGetMembershipsQuery, useRenewMembershipMutation, useCancelMembershipMutation } from '@/lib/api/membershipsApi';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { selectCurrentOrganization, addNotification } from '@/lib/redux/slices/uiSlice';

export default function MembershipsPage() {
  const dispatch = useAppDispatch();
  const currentOrganization = useAppSelector(selectCurrentOrganization);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const { data: memberships, isLoading } = useGetMembershipsQuery({ 
    organizationId: currentOrganization || undefined 
  });
  const [renewMembership] = useRenewMembershipMutation();
  const [cancelMembership] = useCancelMembershipMutation();

  const filteredMemberships = memberships?.filter(membership => {
    const matchesSearch = 
      membership.member?.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      membership.member?.last_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || membership.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'expired': return 'bg-red-500/20 border-red-500/50 text-red-400';
      case 'pending': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      default: return 'bg-gray-500/20 border-gray-500/50 text-gray-400';
    }
  };

  const handleRenew = async (id: number, planId: number) => {
    try {
      await renewMembership({ id, planId }).unwrap();
      dispatch(addNotification({ type: 'success', message: 'Membership renewed successfully' }));
    } catch {
      dispatch(addNotification({ type: 'error', message: 'Failed to renew membership' }));
    }
  };

  const handleCancel = async (id: number) => {
    if (window.confirm('Are you sure you want to cancel this membership?')) {
      try {
        await cancelMembership(id).unwrap();
        dispatch(addNotification({ type: 'success', message: 'Membership cancelled' }));
      } catch {
        dispatch(addNotification({ type: 'error', message: 'Failed to cancel membership' }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-2">
            Memberships
          </h1>
          <p className="text-gray-400 font-bold">Manage member subscriptions</p>
        </div>
        <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black px-6 py-3 rounded-lg hover:scale-105 transform transition-all flex items-center gap-2 shadow-lg shadow-yellow-500/50">
          <Plus className="w-5 h-5" />
          New Membership
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { 
            label: 'Total Memberships', 
            value: memberships?.length || 0, 
            gradient: 'from-yellow-400 to-orange-500',
            icon: CreditCard 
          },
          { 
            label: 'Active', 
            value: memberships?.filter(m => m.status === 'active')?.length || 0, 
            gradient: 'from-green-500 to-emerald-500',
            icon: CheckCircle 
          },
          { 
            label: 'Expiring Soon', 
            value: memberships?.filter(m => {
              const daysLeft = Math.floor((new Date(m.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              return daysLeft > 0 && daysLeft <= 7;
            })?.length || 0, 
            gradient: 'from-yellow-500 to-orange-500',
            icon: AlertCircle 
          },
          { 
            label: 'Expired', 
            value: memberships?.filter(m => m.status === 'expired')?.length || 0, 
            gradient: 'from-red-500 to-orange-400',
            icon: XCircle 
          }
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

      {/* Filters & Search */}
      <div className="bg-gradient-to-br from-gray-900/50 to-black border-2 border-yellow-500/20 rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search memberships..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border border-yellow-500/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-yellow-500/50 focus:outline-none font-bold"
            />
          </div>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-gray-800 border border-yellow-500/20 rounded-lg px-4 py-3 text-white focus:border-yellow-500/50 focus:outline-none font-bold"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Memberships Table */}
      <div className="bg-gradient-to-br from-gray-900/50 to-black border-2 border-yellow-500/20 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            <p className="text-gray-400 mt-4 font-bold">Loading memberships...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-b-2 border-yellow-500/20">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-yellow-400 uppercase tracking-wider">Member</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-yellow-400 uppercase tracking-wider">Plan</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-yellow-400 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-yellow-400 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-yellow-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-yellow-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-yellow-500/10">
                {filteredMemberships?.map((membership) => {
                  const daysLeft = Math.floor((new Date(membership.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <tr key={membership.id} className="hover:bg-yellow-500/5 transition-all">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-black" />
                          </div>
                          <div>
                            <p className="font-black text-white">
                              {membership.member?.first_name} {membership.member?.last_name}
                            </p>
                            <p className="text-sm text-gray-400 font-medium">ID: {membership.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-black text-white">{membership.plan?.name || 'N/A'}</p>
                        <p className="text-sm text-gray-400 font-medium">${membership.total_amount}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-300 font-medium">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            {new Date(membership.start_date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-300 font-medium">
                            <Clock className="w-4 h-4 text-gray-500" />
                            {new Date(membership.end_date).toLocaleDateString()}
                          </div>
                          {daysLeft > 0 && daysLeft <= 7 && (
                            <p className="text-xs text-yellow-400 font-bold">Expires in {daysLeft} days</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-400" />
                            <span className="text-sm text-gray-300 font-medium">
                              Paid: ${membership.paid_amount}
                            </span>
                          </div>
                          {Number(membership.remaining_amount) > 0 && (
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-red-400" />
                              <span className="text-sm text-red-400 font-bold">
                                Due: ${membership.remaining_amount}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-black rounded-full border ${getStatusColor(membership.status)}`}>
                          {membership.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleRenew(membership.id, membership.plan?.id || 1)}
                            className="px-3 py-2 bg-green-500/20 border border-green-500/50 text-green-400 text-xs font-black rounded-lg hover:bg-green-500/30 transition-all"
                          >
                            Renew
                          </button>
                          <button 
                            onClick={() => handleCancel(membership.id)}
                            className="px-3 py-2 bg-red-500/20 border border-red-500/50 text-red-400 text-xs font-black rounded-lg hover:bg-red-500/30 transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}