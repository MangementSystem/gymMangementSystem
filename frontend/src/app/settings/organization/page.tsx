"use client";
import { useState } from 'react';
import { Building, Save, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { useGetOrganizationByIdQuery, useUpdateOrganizationMutation } from '@/lib/api/organizationsApi';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { selectCurrentOrganization, addNotification } from '@/lib/redux/slices/uiSlice';

export default function OrganizationSettingsPage() {
  const dispatch = useAppDispatch();
  const currentOrganization = useAppSelector(selectCurrentOrganization);
  const { data: organization, isLoading } = useGetOrganizationByIdQuery(currentOrganization || 1, { skip: !currentOrganization });
  const [updateOrganization, { isLoading: isSaving }] = useUpdateOrganizationMutation();

  const [formData, setFormData] = useState({
    name: organization?.name || '',
    address: organization?.address || '',
    phone: organization?.phone || '',
  });

  const handleSave = async () => {
    if (!currentOrganization) return;
    try {
      await updateOrganization({ id: currentOrganization, data: formData }).unwrap();
      dispatch(addNotification({ type: 'success', message: 'Organization updated successfully' }));
    } catch {
      dispatch(addNotification({ type: 'error', message: 'Failed to update organization' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-2">
          Organization Settings
        </h1>
        <p className="text-gray-400 font-bold">Manage your organization details</p>
      </div>

      <div className="max-w-4xl">
        <div className="bg-gradient-to-br from-gray-900/50 to-black border-2 border-yellow-500/20 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
              <Building className="w-8 h-8 text-black" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Organization Profile</h2>
              <p className="text-gray-400 font-medium">Update your organization information</p>
            </div>
          </div>

          {isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-black text-yellow-400 mb-2">Organization Name</label>
                <div className="relative">
                  <Building className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-800 border border-yellow-500/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-yellow-500/50 focus:outline-none font-bold"
                    placeholder="Enter organization name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-yellow-400 mb-2">Address</label>
                <div className="relative">
                  <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                  <textarea
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-gray-800 border border-yellow-500/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-yellow-500/50 focus:outline-none font-bold"
                    placeholder="Enter full address"
                    rows={3}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-yellow-400 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-gray-800 border border-yellow-500/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-yellow-500/50 focus:outline-none font-bold"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-yellow-500/20">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black px-8 py-3 rounded-lg hover:scale-105 transform transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button className="bg-gray-800 border border-yellow-500/20 text-gray-400 font-black px-8 py-3 rounded-lg hover:border-yellow-500/50 transition-all">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}