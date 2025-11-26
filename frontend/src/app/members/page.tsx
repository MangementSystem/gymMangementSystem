"use client";
import { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Filter,
  Download,
  UserCircle,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';
import { useGetMembersQuery, useDeleteMemberMutation } from '@/lib/api/membersApi';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { selectCurrentOrganization, addNotification } from '@/lib/redux/slices/uiSlice';

export default function MembersPage() {
  const dispatch = useAppDispatch();
  const currentOrganization = useAppSelector(selectCurrentOrganization);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const { data: members, isLoading } = useGetMembersQuery(
    { organizationId: currentOrganization || undefined },
    { skip: !currentOrganization }
  );
  const [deleteMember] = useDeleteMemberMutation();

  const filteredMembers = members?.filter(member => {
    const matchesSearch = 
      member.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteMember(id).unwrap();
        dispatch(addNotification({
          type: 'success',
          message: 'Member deleted successfully'
        }));
      } catch (error) {
        dispatch(addNotification({
          type: 'error',
          message: 'Failed to delete member'
        }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-2">
            Members
          </h1>
          <p className="text-gray-400 font-bold">Manage your gym members</p>
        </div>
        <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black px-6 py-3 rounded-lg hover:scale-105 transform transition-all flex items-center gap-2 shadow-lg shadow-yellow-500/50">
          <Plus className="w-5 h-5" />
          Add Member
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Members', value: members?.length || 0, gradient: 'from-yellow-400 to-orange-500' },
          { label: 'Active', value: members?.filter(m => m.memberships?.some(ms => ms.status === 'active'))?.length || 0, gradient: 'from-orange-500 to-red-500' },
          { label: 'New This Month', value: 12, gradient: 'from-yellow-500 to-red-500' },
          { label: 'Expiring Soon', value: 5, gradient: 'from-red-400 to-orange-400' }
        ].map((stat) => (
          <div key={stat.label} className={`bg-gradient-to-br ${stat.gradient} p-6 rounded-xl shadow-lg`}>
            <p className="text-black/70 text-sm font-black mb-1">{stat.label}</p>
            <p className="text-4xl font-black text-black">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-gradient-to-br from-gray-900/50 to-black border-2 border-yellow-500/20 rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border border-yellow-500/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-yellow-500/50 focus:outline-none font-bold"
            />
          </div>

          {/* Filter */}
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

          {/* Export Button */}
          <button className="bg-gray-800 border border-yellow-500/20 rounded-lg px-6 py-3 text-yellow-400 hover:border-yellow-500/50 transition-all font-black flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-gradient-to-br from-gray-900/50 to-black border-2 border-yellow-500/20 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            <p className="text-gray-400 mt-4 font-bold">Loading members...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-b-2 border-yellow-500/20">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-yellow-400 uppercase tracking-wider">Member</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-yellow-400 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-yellow-400 uppercase tracking-wider">Join Date</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-yellow-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-yellow-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-yellow-500/10">
                {filteredMembers?.map((member) => (
                  <tr key={member.id} className="hover:bg-yellow-500/5 transition-all">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                          <UserCircle className="w-6 h-6 text-black" />
                        </div>
                        <div>
                          <p className="font-black text-white">{member.first_name} {member.last_name}</p>
                          <p className="text-sm text-gray-400 font-medium">{member.goal || 'No goal set'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {member.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-300 font-medium">
                            <Mail className="w-4 h-4 text-gray-500" />
                            {member.email}
                          </div>
                        )}
                        {member.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-300 font-medium">
                            <Phone className="w-4 h-4 text-gray-500" />
                            {member.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-300 font-medium">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        {member.join_date ? new Date(member.join_date).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/50 text-green-400 text-xs font-black rounded-full">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 bg-blue-500/20 border border-blue-500/50 rounded-lg hover:bg-blue-500/30 transition-all">
                          <Eye className="w-4 h-4 text-blue-400" />
                        </button>
                        <button className="p-2 bg-yellow-500/20 border border-yellow-500/50 rounded-lg hover:bg-yellow-500/30 transition-all">
                          <Edit className="w-4 h-4 text-yellow-400" />
                        </button>
                        <button 
                          onClick={() => handleDelete(member.id, `${member.first_name} ${member.last_name}`)}
                          className="p-2 bg-red-500/20 border border-red-500/50 rounded-lg hover:bg-red-500/30 transition-all"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
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
  );
}