import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatusBadge from '../../components/common/StatusBadge';
import Pagination from '../../components/common/Pagination';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';
import { getPatientAppointmentsAPI, cancelAppointmentAPI } from '../../services/appointmentService';
import { toast } from 'react-toastify';
import { FiCalendar, FiUser, FiSearch, FiGrid, FiX, FiEye } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const navItems = [
  { to: '/patient/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/patient/profile', icon: FiUser, label: 'My Profile' },
  { to: '/patient/appointments', icon: FiCalendar, label: 'My Appointments' },
  { to: '/doctors', icon: FiSearch, label: 'Find Doctors' },
];

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [cancelModal, setCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const fetchAppointments = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 8 };
      if (statusFilter) params.status = statusFilter;
      const res = await getPatientAppointmentsAPI(params);
      setAppointments(res.data.data);
      setPagination(res.data.pagination);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(1); }, [statusFilter]);

  const handleCancel = async () => {
    setCancelLoading(true);
    try {
      await cancelAppointmentAPI(selected._id);
      toast.success('Appointment cancelled');
      setCancelModal(false);
      fetchAppointments(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancel failed');
    } finally {
      setCancelLoading(false);
    }
  };

  const statuses = ['', 'pending', 'accepted', 'cancelled', 'completed'];

  return (
    <DashboardLayout navItems={navItems} title="My Appointments">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-800">All Appointments</h2>
        <Link to="/doctors" className="btn-primary text-sm">+ Book New</Link>
      </div>

      {/* Filter */}
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
          <p className="text-gray-500 text-lg">No appointments found</p>
          <Link to="/doctors" className="btn-primary mt-4 inline-block text-sm">Book Your First Appointment</Link>
        </div>
      ) : (
        <>
          <div className="card overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="text-gray-500 border-b text-left">
                  <th className="pb-3 font-medium">Doctor</th>
                  <th className="pb-3 font-medium">Date & Time</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Fee</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {appointments.map((apt) => (
                  <tr key={apt._id} className="hover:bg-gray-50">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img src={apt.doctor?.user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(apt.doctor?.user?.name || 'Dr')}&background=3b82f6&color=fff`}
                          alt="" className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="font-medium text-gray-800">{apt.doctor?.user?.name}</p>
                          <p className="text-xs text-blue-600">{apt.doctor?.specialization}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <p className="text-gray-800">{new Date(apt.appointmentDate).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">{apt.appointmentTime}</p>
                    </td>
                    <td className="py-4"><StatusBadge status={apt.status} /></td>
                    <td className="py-4 text-gray-700">${apt.doctor?.consultationFee}</td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <button onClick={() => { setSelected(apt); }} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100" title="View">
                          <FiEye size={16} />
                        </button>
                        {['pending', 'accepted'].includes(apt.status) && (
                          <button onClick={() => { setSelected(apt); setCancelModal(true); }} className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100" title="Cancel">
                            <FiX size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={pagination.page} totalPages={pagination.pages} onPageChange={fetchAppointments} />
        </>
      )}

      {/* Cancel Confirm Modal */}
      <Modal isOpen={cancelModal} onClose={() => setCancelModal(false)} title="Cancel Appointment" size="sm">
        <p className="text-gray-600 mb-5">Are you sure you want to cancel this appointment with <strong>{selected?.doctor?.user?.name}</strong> on <strong>{selected && new Date(selected.appointmentDate).toLocaleDateString()}</strong>?</p>
        <div className="flex gap-3">
          <button onClick={() => setCancelModal(false)} className="btn-secondary flex-1">Keep it</button>
          <button onClick={handleCancel} disabled={cancelLoading} className="btn-danger flex-1">
            {cancelLoading ? 'Cancelling...' : 'Yes, Cancel'}
          </button>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default MyAppointments;
