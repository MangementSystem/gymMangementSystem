'use client';
import { useState } from 'react';
import {
  useGetDevicesQuery,
  useCreateDeviceMutation,
  useUpdateDeviceMutation,
} from '@/lib/api/attendanceApi';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { addNotification, selectCurrentOrganization } from '@/lib/redux/slices/uiSlice';
import { Tablet, Plus, Search, Wifi, WifiOff, Settings, CheckCircle, XCircle } from 'lucide-react';

export default function AttendanceDevicesPage() {
  const dispatch = useAppDispatch();
  const currentOrganization = useAppSelector(selectCurrentOrganization);
  const { data: devices, isLoading } = useGetDevicesQuery({
    organizationId: currentOrganization || undefined,
  });
  const [createDevice] = useCreateDeviceMutation();
  const [updateDevice] = useUpdateDeviceMutation();

  const [openAdd, setOpenAdd] = useState(false);
  const [openConfigure, setOpenConfigure] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [configuringDevice, setConfiguringDevice] = useState<any>(null);

  const [form, setForm] = useState({
    name: '',
    serial_number: '',
    ip_address: '',
    status: 'active',
  });

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e: any) => {
    e.preventDefault();
    try {
      await createDevice({
        ...form,
        organizationId: currentOrganization || undefined,
      }).unwrap();

      dispatch(addNotification({ type: 'success', message: 'Device added successfully' }));
      setOpenAdd(false);
      setForm({
        name: '',
        serial_number: '',
        ip_address: '',
        status: 'active',
      });
    } catch (error: any) {
      dispatch(
        addNotification({
          type: 'error',
          message: error?.data?.message || 'Failed to add device',
        }),
      );
    }
  };

  const openConfigureModal = (device: any) => {
    setConfiguringDevice(device);
    setForm({
      name: device.name || '',
      serial_number: device.serial_number || '',
      ip_address: device.ip_address || '',
      status: device.status || 'inactive',
    });
    setOpenConfigure(true);
  };

  const handleConfigure = async (e: any) => {
    e.preventDefault();

    if (!configuringDevice) return;

    try {
      await updateDevice({
        id: configuringDevice.id,
        data: {
          name: form.name,
          serial_number: form.serial_number,
          ip_address: form.ip_address || undefined,
          status: form.status,
        },
      }).unwrap();

      dispatch(addNotification({ type: 'success', message: 'Device updated successfully' }));
      setOpenConfigure(false);
      setConfiguringDevice(null);
    } catch (error: any) {
      dispatch(
        addNotification({
          type: 'error',
          message: error?.data?.message || 'Failed to update device',
        }),
      );
    }
  };

  const filteredDevices = devices?.filter(
    (device: any) =>
      device.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.serial_number?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
            Attendance Devices
          </h1>
          <p className="text-gray-400 font-bold">Manage check-in devices</p>
        </div>
        <button
          onClick={() => setOpenAdd(true)}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black px-6 py-3 rounded-lg hover:scale-105 transform transition-all flex items-center gap-2 shadow-lg shadow-yellow-500/50"
        >
          <Plus className="w-5 h-5" />
          Add Device
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          {
            label: 'Total Devices',
            value: devices?.length || 0,
            gradient: 'from-yellow-400 to-orange-500',
            icon: Tablet,
          },
          {
            label: 'Online',
            value: devices?.filter((d: any) => d.status === 'active')?.length || 0,
            gradient: 'from-green-500 to-emerald-500',
            icon: CheckCircle,
          },
          {
            label: 'Offline',
            value: devices?.filter((d: any) => d.status === 'inactive')?.length || 0,
            gradient: 'from-red-500 to-orange-500',
            icon: XCircle,
          },
          {
            label: 'Connected',
            value: devices?.filter((d: any) => d.ip_address)?.length || 0,
            gradient: 'from-blue-500 to-cyan-500',
            icon: Wifi,
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

      {/* Search */}
      <div className="bg-gradient-to-br from-gray-900/50 to-black border border-yellow-500/20 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 bg-black/50 px-4 py-2 rounded-lg border border-yellow-500/20 max-w-md">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search devices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-white flex-1"
          />
        </div>
      </div>

      {/* Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDevices?.map((device: any) => (
          <div
            key={device.id}
            className="bg-gradient-to-br from-gray-900/50 to-black border border-yellow-500/20 rounded-xl p-6 hover:border-yellow-500/50 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <Tablet className="w-7 h-7 text-black" />
              </div>
              <div className="flex items-center gap-2">
                {device.status === 'active' ? (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-green-500/20 text-green-400">
                    <Wifi className="w-3 h-3" />
                    Online
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-red-500/20 text-red-400">
                    <WifiOff className="w-3 h-3" />
                    Offline
                  </span>
                )}
              </div>
            </div>

            <h3 className="text-xl font-black text-white mb-1">{device.name}</h3>
            <p className="text-gray-500 text-sm mb-4">S/N: {device.serial_number}</p>

            {device.ip_address && (
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                <Wifi className="w-4 h-4 text-yellow-400" />
                <span>IP: {device.ip_address}</span>
              </div>
            )}

            <div className="flex items-center gap-2 pt-4 border-t border-yellow-500/10">
              <button
                onClick={() => openConfigureModal(device)}
                className="flex-1 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Configure
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDevices?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <Tablet className="w-20 h-20 text-gray-600 mb-6" />
          <h2 className="text-2xl font-black text-white mb-2">No Devices Found</h2>
          <p className="text-gray-400">Add your first attendance device to get started</p>
        </div>
      )}

      {/* Add Modal */}
      {openAdd && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-500/30 rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-black text-white mb-6">Add Device</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <input
                name="name"
                placeholder="Device name"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500"
                required
              />
              <input
                name="serial_number"
                placeholder="Serial number"
                value={form.serial_number}
                onChange={handleChange}
                className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500"
                required
              />
              <input
                name="ip_address"
                placeholder="IP address (optional)"
                value={form.ip_address}
                onChange={handleChange}
                className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500"
              />
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
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
                  Add Device
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Configure Modal */}
      {openConfigure && configuringDevice && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-500/30 rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-black text-white mb-6">Configure Device</h2>
            <form onSubmit={handleConfigure} className="space-y-4">
              <input
                name="name"
                placeholder="Device name"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500"
                required
              />
              <input
                name="serial_number"
                placeholder="Serial number"
                value={form.serial_number}
                onChange={handleChange}
                className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500"
                required
              />
              <input
                name="ip_address"
                placeholder="IP address (optional)"
                value={form.ip_address}
                onChange={handleChange}
                className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500"
              />
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full bg-black/50 border border-yellow-500/20 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setOpenConfigure(false);
                    setConfiguringDevice(null);
                  }}
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
