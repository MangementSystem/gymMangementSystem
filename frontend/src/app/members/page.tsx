'use client';

import { useState } from 'react';
import {
  useGetMembersQuery,
  useCreateMemberMutation,
  useUpdateMemberMutation,
  useDeleteMemberMutation,
} from '@/lib/api/membersApi';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { selectCurrentOrganization, addNotification } from '@/lib/redux/slices/uiSlice';
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  X,
  ChevronRight,
} from 'lucide-react';

const initialFormData = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  gender: 'male',
};

export default function MembersPage() {
  const dispatch = useAppDispatch();
  const currentOrganization = useAppSelector(selectCurrentOrganization);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'inactive'>(
    'all',
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);

  const {
    data: members,
    isLoading,
    error,
  } = useGetMembersQuery({
    organizationId: currentOrganization || undefined,
  });

  const [createMember, { isLoading: isCreating }] = useCreateMemberMutation();
  const [updateMember, { isLoading: isUpdating }] = useUpdateMemberMutation();
  const [deleteMember] = useDeleteMemberMutation();

  const [formData, setFormData] = useState(initialFormData);

  const handleOpenAdd = () => {
    setFormData(initialFormData);
    setShowAddModal(true);
  };

  const handleOpenEdit = (member: any) => {
    setEditingMember(member);
    setFormData({
      first_name: member.first_name,
      last_name: member.last_name,
      email: member.email || '',
      phone: member.phone || '',
      gender: member.gender || 'male',
    });
    setShowEditModal(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMember({
        ...formData,
        organizationId: currentOrganization || undefined,
      }).unwrap();
      dispatch(addNotification({ type: 'success', message: 'Member added successfully' }));
      setShowAddModal(false);
      setFormData(initialFormData);
    } catch (err: any) {
      dispatch(
        addNotification({ type: 'error', message: err.data?.message || 'Failed to add member' }),
      );
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMember({
        id: editingMember.id,
        data: formData,
      }).unwrap();
      dispatch(addNotification({ type: 'success', message: 'Member updated successfully' }));
      setShowEditModal(false);
      setEditingMember(null);
    } catch (err: any) {
      dispatch(
        addNotification({ type: 'error', message: err.data?.message || 'Failed to update member' }),
      );
    }
  };

  const handleDelete = async (id: number) => {
    if (
      window.confirm('Are you sure you want to delete this member? This action cannot be undone.')
    ) {
      try {
        await deleteMember(id).unwrap();
        dispatch(addNotification({ type: 'success', message: 'Member deleted' }));
      } catch {
        dispatch(addNotification({ type: 'error', message: 'Failed to delete member' }));
      }
    }
  };

  const getMemberStatus = (member: any) => {
    const membershipStatuses = (member.memberships || []).map((membership: any) =>
      String(membership.status || '').toLowerCase(),
    );

    if (membershipStatuses.includes('active') || membershipStatuses.includes('renewed')) {
      return 'active';
    }

    if (membershipStatuses.includes('pending')) {
      return 'pending';
    }

    return 'inactive';
  };

  const cycleStatusFilter = () => {
    setStatusFilter((current) => {
      if (current === 'all') return 'active';
      if (current === 'active') return 'pending';
      if (current === 'pending') return 'inactive';
      return 'all';
    });
  };

  const filteredMembers =
    members?.filter(
      (member) =>
        (`${member.first_name} ${member.last_name}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
          member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.phone?.includes(searchTerm)) &&
        (statusFilter === 'all' || getMemberStatus(member) === statusFilter),
    ) || [];

  const stats = filteredMembers.reduce(
    (acc, member) => {
      const memberStatus = getMemberStatus(member);
      acc.total += 1;
      if (memberStatus === 'active') acc.active += 1;
      if (memberStatus === 'pending') acc.pending += 1;
      if (memberStatus === 'inactive') acc.inactive += 1;
      return acc;
    },
    { total: 0, active: 0, pending: 0, inactive: 0 },
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gradient-to-r from-gray-900 to-black">
        <div className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Members</h1>
              <p className="text-gray-400">Manage your gym members and their subscriptions</p>
            </div>
            <button
              onClick={handleOpenAdd}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/20"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Member
            </button>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Search and Filter */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
          <button
            onClick={cycleStatusFilter}
            className="flex items-center px-6 py-3 bg-gray-900 border border-gray-700 rounded-lg hover:border-orange-500 transition-colors"
          >
            <Filter className="w-5 h-5 mr-2" />
            {statusFilter === 'all' ? 'Filter: All' : `Filter: ${statusFilter}`}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Members', value: stats.total, color: 'text-white' },
            { label: 'Active', value: stats.active, color: 'text-green-500' },
            { label: 'Pending', value: stats.pending, color: 'text-yellow-500' },
            { label: 'Inactive', value: stats.inactive, color: 'text-red-500' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6"
            >
              <div className="text-sm text-gray-400 mb-2">{stat.label}</div>
              <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Members List */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-xl">
          {isLoading ? (
            <div className="p-12 text-center text-gray-400">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              Loading members...
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-500">Error loading members</div>
          ) : filteredMembers.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
              <p className="text-gray-400 mb-4 text-xl">No members found</p>
              <button
                onClick={handleOpenAdd}
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Add Your First Member
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black/40">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-black/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-lg font-bold mr-4 shadow-lg">
                            {member.first_name[0]}
                            {member.last_name[0]}
                          </div>
                          <div>
                            <div className="font-bold text-lg">
                              {member.first_name} {member.last_name}
                            </div>
                            <div className="text-sm text-gray-500 font-mono">#{member.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {member.email && (
                            <div className="flex items-center text-sm text-gray-300">
                              <Mail className="w-4 h-4 mr-2 text-orange-500/70" />
                              {member.email}
                            </div>
                          )}
                          {member.phone && (
                            <div className="flex items-center text-sm text-gray-300">
                              <Phone className="w-4 h-4 mr-2 text-orange-500/70" />
                              {member.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="capitalize text-sm font-medium px-2 py-1 bg-gray-800 rounded">
                          {member.gender || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-400 font-medium">
                          <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                          {member.created_at
                            ? new Date(member.created_at).toLocaleDateString()
                            : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {(() => {
                          const memberStatus = getMemberStatus(member);
                          return (
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                memberStatus === 'active'
                                  ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                  : memberStatus === 'pending'
                                    ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                    : 'bg-red-500/10 text-red-500 border border-red-500/20'
                              }`}
                            >
                              {memberStatus}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenEdit(member)}
                            className="p-2 hover:bg-orange-500/10 text-orange-500 rounded-lg transition-colors border border-transparent hover:border-orange-500/20"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(member.id)}
                            className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                            title="Delete"
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
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold flex items-center">
                {showAddModal ? (
                  <Plus className="mr-2 text-orange-500" />
                ) : (
                  <Edit className="mr-2 text-orange-500" />
                )}
                {showAddModal ? 'Add New Member' : 'Edit Member'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                }}
                className="text-gray-500 hover:text-white transition-colors p-1 hover:bg-gray-700 rounded"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form
              onSubmit={showAddModal ? handleAddSubmit : handleEditSubmit}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 transition-all text-white placeholder-gray-600"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 transition-all text-white placeholder-gray-600"
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-black/50 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 transition-all text-white placeholder-gray-600"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-black/50 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 transition-all text-white placeholder-gray-600"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Gender</label>
                <div className="grid grid-cols-3 gap-2">
                  {['male', 'female', 'other'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: g })}
                      className={`py-2 px-3 rounded-xl border text-sm font-bold capitalize transition-all ${
                        formData.gender === g
                          ? 'border-orange-500 bg-orange-500/10 text-orange-500'
                          : 'border-gray-700 bg-black/30 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                  }}
                  className="flex-1 px-6 py-4 bg-gray-800 rounded-xl font-bold hover:bg-gray-700 transition-colors text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl font-bold hover:opacity-90 transition-all text-white shadow-lg shadow-orange-500/20 flex items-center justify-center disabled:opacity-50"
                >
                  {isCreating || isUpdating ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      {showAddModal ? 'Add Member' : 'Update Member'}
                      <ChevronRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
