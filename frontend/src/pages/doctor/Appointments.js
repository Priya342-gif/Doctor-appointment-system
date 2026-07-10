import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import Spinner from '../../components/common/Spinner';
import { getDoctorAppointmentsAPI, updateAppointmentStatusAPI } from '../../services/appointmentService';
import { toast } from 'react-toastify';
import { FiCalendar, FiUser, FiGrid, FiClock, FiCheck, FiX } from 'react-icons/fi';

const navItems = [
  { to: '/doctor/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/doctor/today', icon: FiClock, label: "Today's Appointments" },
  { to: '/doctor/appointments', icon: FiCalendar, label: 'All Appointments' },
  { to: '/doctor/profile', icon: FiUser, label: 'My Profile' },
];

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [statusFilter, setStatusFilter] = useState('');
  const [updating, setUpdating] = useState('');

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      const res = await getDoctorAppointmentsAPI(params);
      setAppointments(res.data.data);
      setPagination(res.data.pagination);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(1); }, [statusFilter]);

  const updateStatus = async (id, status) => {
    setUpdating(id + status);
    try {
      await updateAppointmentStatusAPI(id, { status });
      toast.success(`Appointment ${status}`);
      fetchData(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdating('');
    }
  };

  const statuses = ['', 'pending', 'accepted', 'cancelled', 'completed'];

  return (
    <DashboardLayout navItems={navItems} title="All Appointments">
      <div className="flex gap-2 mb-5 flex-wrap">
        {statuses.map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${statusFilter === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All'}
          </button>
        ))}
      </div>

      {loading ? <Spinner /> : appointments.length === 0 ? (
        <div className="card text-center py-16">
          <FiCalendar className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="text-gray-500">No appointments found</p>
        </div>
      ) : (
        <>
          <div className="card overflow-x-auto">
            <table className="w-full text-sm min-w-[650px]">
              <thead>
                <tr className="text-gray-500 border-b text-left">
                  <th className="pb-3 font-medium">Patient</th>
                  <th className="pb-3 font-medium">Date & Time</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Notes</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {appointments.map((apt) => (
                  <tr key={apt._id} className="hover:bg-gray-50">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img src={apt.patient?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(apt.patient?.name || 'P')}&background=10b981&color=fff`}
                          alt="" className="w-9 h-9 rounded-full" />
                        <div>
                          <p className="font-medium text-gray-800">{apt.patient?.name}</p>
                          <p className="text-xs text-gray-500">{apt.patient?.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <p className="text-gray-800">{new Date(apt.appointmentDate).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">{apt.appointmentTime}</p>
                    </td>
                    <td className="py-4"><StatusBadge status={apt.status} /></td>
                    <td className="py-4 text-xs text-gray-500 max-w-[120px] truncate">{apt.notes || '—'}</td>
                    <td className="py-4">
                      <div className="flex gap-1">
                        {apt.status === 'pending' && (
                          <>
                            <button onClick={() => updateStatus(apt._id, 'accepted')} disabled={!!updating} className="btn-success text-xs px-2 py-1 flex items-center gap-1">
                              <FiCheck size={12} /> Accept
                            </button>
                            <button onClick={() => updateStatus(apt._id, 'cancelled')} disabled={!!updating} className="btn-danger text-xs px-2 py-1 flex items-center gap-1">
                              <FiX size={12} /> Reject
                            </button>
                          </>
                        )}
                        {apt.status === 'accepted' && (
                          <button onClick={() => updateStatus(apt._id, 'completed')} disabled={!!updating} className="btn-primary text-xs px-2 py-1">
                            Complete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={pagination.page} totalPages={pagination.pages} onPageChange={fetchData} />
        </>
      )}
    </DashboardLayout>
  );
};

export default DoctorAppointments;
