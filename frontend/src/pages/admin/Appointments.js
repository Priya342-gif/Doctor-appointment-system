import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import Spinner from '../../components/common/Spinner';
import { getAllAppointmentsAPI, updateAppointmentStatusAPI } from '../../services/appointmentService';
import { toast } from 'react-toastify';
import { FiGrid, FiCalendar, FiUserCheck, FiSearch, FiCheck, FiX } from 'react-icons/fi';
import { FaUserMd, FaUserInjured } from 'react-icons/fa';

const navItems = [
  { to: '/admin/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/admin/doctors', icon: FaUserMd, label: 'Doctors' },
  { to: '/admin/patients', icon: FaUserInjured, label: 'Patients' },
  { to: '/admin/appointments', icon: FiCalendar, label: 'Appointments' },
  { to: '/admin/add-doctor', icon: FiUserCheck, label: 'Add Doctor' },
];

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [statusFilter, setStatusFilter] = useState('');
  const [updating, setUpdating] = useState('');

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (statusFilter) params.status = statusFilter;
      const res = await getAllAppointmentsAPI(params);
      setAppointments(res.data.data);
      setPagination(res.data.pagination);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(1); }, [statusFilter]);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await updateAppointmentStatusAPI(id, { status });
      toast.success(`Appointment ${status}`);
      fetchData(pagination.page);
    } catch {
      toast.error('Update failed');
    } finally {
      setUpdating('');
    }
  };

  const statuses = ['', 'pending', 'accepted', 'cancelled', 'completed'];

  return (
    <DashboardLayout navItems={navItems} title="Appointments Management">
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
            <table className="w-full text-sm min-w-[800px]">
              <thead>
                <tr className="text-gray-500 border-b text-left">
                  <th className="pb-3 font-medium">Patient</th>
                  <th className="pb-3 font-medium">Doctor</th>
                  <th className="pb-3 font-medium">Date & Time</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {appointments.map((apt) => (
                  <tr key={apt._id} className="hover:bg-gray-50">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <img src={apt.patient?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(apt.patient?.name || 'P')}&background=10b981&color=fff`}
                          alt="" className="w-8 h-8 rounded-full" />
                        <span className="font-medium text-gray-800">{apt.patient?.name}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <img src={apt.doctor?.user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(apt.doctor?.user?.name || 'Dr')}&background=3b82f6&color=fff`}
                          alt="" className="w-8 h-8 rounded-full" />
                        <div>
                          <p className="font-medium text-gray-800">{apt.doctor?.user?.name}</p>
                          <p className="text-xs text-blue-600">{apt.doctor?.specialization}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <p>{new Date(apt.appointmentDate).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">{apt.appointmentTime}</p>
                    </td>
                    <td className="py-3"><StatusBadge status={apt.status} /></td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        {apt.status === 'pending' && (
                          <>
                            <button onClick={() => updateStatus(apt._id, 'accepted')} disabled={!!updating} className="btn-success text-xs px-2 py-1"><FiCheck size={12} /></button>
                            <button onClick={() => updateStatus(apt._id, 'cancelled')} disabled={!!updating} className="btn-danger text-xs px-2 py-1"><FiX size={12} /></button>
                          </>
                        )}
                        {apt.status === 'accepted' && (
                          <button onClick={() => updateStatus(apt._id, 'completed')} disabled={!!updating} className="btn-primary text-xs px-2 py-1">Done</button>
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

export default AdminAppointments;
