'use client';
import { useState } from 'react';
import {
  CreditCard,
  Plus,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Calendar,
  X,
} from 'lucide-react';
import {
  useGetMembershipsQuery,
  useCreateMembershipMutation,
  useRenewMembershipMutation,
  useCancelMembershipMutation,
} from '@/lib/api/membershipsApi';
import { useGetMembersQuery } from '@/lib/api/membersApi';
import { useGetPlansQuery } from '@/lib/api/plansApi';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { selectCurrentOrganization, addNotification } from '@/lib/redux/slices/uiSlice';

export default function MembershipsPage() {
  const dispatch = useAppDispatch();
  const currentOrganization = useAppSelector(selectCurrentOrganization);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [openAdd, setOpenAdd] = useState(false);

  const { data: memberships, isLoading } = useGetMembershipsQuery({
    organizationId: currentOrganization || undefined,
  });
  const { data: members } = useGetMembersQuery({
    organizationId: currentOrganization || undefined,
  });
  const { data: plans } = useGetPlansQuery({
    organizationId: currentOrganization || undefined,
  });
  const [createMembership] = useCreateMembershipMutation();
  const [renewMembership] = useRenewMembershipMutation();
  const [cancelMembership] = useCancelMembershipMutation();

  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({
    memberId: '',
    planId: '',
    start_date: today,
    end_date: '',
    status: 'active',
    total_amount: '',
    paid_amount: '',
    remaining_amount: '0',
    organizationId: currentOrganization || 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    // Auto-compute remaining
    if (name === 'total_amount' || name === 'paid_amount') {
      const total = parseFloat(name === 'total_amount' ? value : updated.total_amount) || 0;
      const paid = parseFloat(name === 'paid_amount' ? value : updated.paid_amount) || 0;
      updated.remaining_amount = Math.max(0, total - paid).toString();
    }
    // Auto-set end_date based on selected plan
    if (name === 'planId' && plans) {
      const plan = plans.find((p) => p.id === Number(value));
      if (plan && updated.start_date) {
        const end = new Date(updated.start_date);
        end.setDate(end.getDate() + plan.duration_days);
        updated.end_date = end.toISOString().split('T')[0];
        updated.total_amount = String(plan.price);
        updated.remaining_amount = String(
          Math.max(0, plan.price - (parseFloat(updated.paid_amount) || 0)),
        );
      }
    }
    setForm(updated);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMembership({
        memberId: Number(form.memberId),
        planId: Number(form.planId),
        organizationId: currentOrganization || 1,
        start_date: form.start_date,
        end_date: form.end_date,
        status: form.status,
        total_amount: parseFloat(form.total_amount) || 0,
        paid_amount: parseFloat(form.paid_amount) || 0,
        remaining_amount: parseFloat(form.remaining_amount) || 0,
      }).unwrap();
      dispatch(addNotification({ type: 'success', message: 'Membership created successfully' }));
      setOpenAdd(false);
      setForm({
        memberId: '',
        planId: '',
        start_date: today,
        end_date: '',
        status: 'active',
        total_amount: '',
        paid_amount: '',
        remaining_amount: '0',
        organizationId: currentOrganization || 1,
      });
    } catch (err: any) {
      dispatch(
        addNotification({
          type: 'error',
          message: err?.data?.message || 'Failed to create membership',
        }),
      );
    }
  };

  const filteredMemberships = memberships?.filter((membership) => {
    const memberName =
      `${membership.member?.first_name ?? ''} ${membership.member?.last_name ?? ''}`.toLowerCase();
    const matchesSearch = memberName.includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || membership.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'expired':
        return 'bg-red-500/20 border-red-500/50 text-red-400';
      case 'pending':
        return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      case 'cancelled':
        return 'bg-gray-500/20 border-gray-500/50 text-gray-400';
      default:
        return 'bg-gray-500/20 border-gray-500/50 text-gray-400';
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
        <button
          onClick={() => setOpenAdd(true)}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black px-6 py-3 rounded-lg hover:scale-105 transform transition-all flex items-center gap-2 shadow-lg shadow-yellow-500/50"
        >
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
            icon: CreditCard,
          },
          {
            label: 'Active',
            value: memberships?.filter((m) => m.status === 'active')?.length || 0,
            gradient: 'from-green-500 to-emerald-500',
            icon: CheckCircle,
          },
          {
            label: 'Expiring Soon',
            value:
              memberships?.filter((m) => {
                const daysLeft = Math.floor(
                  (new Date(m.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
                );
                return daysLeft > 0 && daysLeft <= 7;
              })?.length || 0,
            gradient: 'from-yellow-500 to-orange-500',
            icon: AlertCircle,
          },
          {
            label: 'Expired',
            value: memberships?.filter((m) => m.status === 'expired')?.length || 0,
            gradient: 'from-red-500 to-orange-400',
            icon: XCircle,
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`bg-gradient-to-br ${stat.gradient} p-6 rounded-xl shadow-lg`}
            >
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
            <option value="cancelled">Cancelled</option>
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
                  <th className="px-6 py-4 text-left text-xs font-black text-yellow-400 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-yellow-400 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-yellow-400 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-yellow-400 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-yellow-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-black text-yellow-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-yellow-500/10">
                {filteredMemberships?.map((membership) => {
                  const daysLeft = Math.floor(
                    (new Date(membership.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
                  );
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
                        <p className="text-sm text-gray-400 font-medium">
                          ${membership.total_amount}
                        </p>
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
                            <p className="text-xs text-yellow-400 font-bold">
                              Expires in {daysLeft} days
                            </p>
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
                        <span
                          className={`px-3 py-1 text-xs font-black rounded-full border ${getStatusColor(membership.status)}`}
                        >
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
                          {membership.status !== 'cancelled' && (
                            <button
                              onClick={() => handleCancel(membership.id)}
                              className="px-3 py-2 bg-red-500/20 border border-red-500/50 text-red-400 text-xs font-black rounded-lg hover:bg-red-500/30 transition-all"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {(!filteredMemberships || filteredMemberships.length === 0) && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p className="font-bold">No memberships found.</p>
                      <p className="text-sm mt-1">
                        Click &quot;New Membership&quot; to create one.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Membership Modal */}
      {openAdd && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-500/30 rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-white">New Membership</h2>
              <button onClick={() => setOpenAdd(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1">Member *</label>
                <select
                  name="memberId"
                  value={form.memberId}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500"
                  required
                >
                  <option value="">Select member...</option>
                  {members?.map((m: any) => (
                    <option key={m.id} value={m.id}>
                      {m.first_name} {m.last_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1">Plan *</label>
                <select
                  name="planId"
                  value={form.planId}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500"
                  required
                >
                  <option value="">Select plan...</option>
                  {plans?.map((p: any) => (
                    <option key={p.id} value={p.id}>
                      {p.name} – ${p.price} / {p.duration_days} days
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-1">Start Date *</label>
                  <input
                    type="date"
                    name="start_date"
                    value={form.start_date}
                    onChange={handleChange}
                    className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-1">End Date *</label>
                  <input
                    type="date"
                    name="end_date"
                    value={form.end_date}
                    onChange={handleChange}
                    className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-1">
                    Total Amount *
                  </label>
                  <input
                    type="number"
                    name="total_amount"
                    value={form.total_amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-1">
                    Paid Amount *
                  </label>
                  <input
                    type="number"
                    name="paid_amount"
                    value={form.paid_amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              {form.remaining_amount && Number(form.remaining_amount) > 0 && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm font-bold">
                  Remaining due: ${form.remaining_amount}
                </div>
              )}
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                </select>
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
                  Create Membership
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
