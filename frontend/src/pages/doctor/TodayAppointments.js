import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatusBadge from '../../components/common/StatusBadge';
import Spinner from '../../components/common/Spinner';
import { getTodayAppointmentsAPI, updateAppointmentStatusAPI } from '../../services/appointmentService';
import { toast } from 'react-toastify';
import { FiCalendar, FiUser, FiGrid, FiClock, FiCheck, FiX } from 'react-icons/fi';

const navItems = [
  { to: '/doctor/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/doctor/today', icon: FiClock, label: "Today's Appointments" },
  { to: '/doctor/appointments', icon: FiCalendar, label: 'All Appointments' },
  { to: '/doctor/profile', icon: FiUser, label: 'My Profile' },
];

const TodayAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getTodayAppointmentsAPI();
      setAppointments(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const updateStatus = async (id, status) => {
    setUpdating(id + status);
    try {
      await updateAppointmentStatusAPI(id, { status });
      toast.success(`Appointment ${status}`);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdating('');
    }
  };

  return (
    <DashboardLayout navItems={navItems} title="Today's Appointments">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-800">
          Today — {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </h2>
        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">{appointments.length} appointments</span>
      </div>

      {loading ? <Spinner /> : appointments.length === 0 ? (
        <div className="card text-center py-16">
          <FiCalendar className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="text-gray-500 text-lg">No appointments today</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {appointments.map((apt) => (
            <div key={apt._id} className="card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={apt.patient?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(apt.patient?.name || 'P')}&background=10b981&color=fff&size=60`}
                    alt={apt.patient?.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">{apt.patient?.name}</h4>
                    <div className="text-sm text-gray-500 space-y-0.5">
                      <p>{apt.patient?.email} • {apt.patient?.phone}</p>
                      <p>Age: {apt.patient?.age} • Gender: {apt.patient?.gender}</p>
                      <p className="flex items-center gap-1"><FiClock size={12} /> {apt.appointmentTime}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-3">
                  <StatusBadge status={apt.status} />
                  {apt.notes && <p className="text-xs text-gray-500 max-w-48 text-right italic">"{apt.notes}"</p>}
                  {apt.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus(apt._id, 'accepted')}
                        disabled={updating === apt._id + 'accepted'}
                        className="btn-success text-xs flex items-center gap-1 px-3 py-1.5"
                      >
                        <FiCheck size={14} /> Accept
                      </button>
                      <button
                        onClick={() => updateStatus(apt._id, 'cancelled')}
                        disabled={updating === apt._id + 'cancelled'}
                        className="btn-danger text-xs flex items-center gap-1 px-3 py-1.5"
                      >
                        <FiX size={14} /> Reject
                      </button>
                    </div>
                  )}
                  {apt.status === 'accepted' && (
                    <button
                      onClick={() => updateStatus(apt._id, 'completed')}
                      disabled={updating === apt._id + 'completed'}
                      className="btn-primary text-xs flex items-center gap-1 px-3 py-1.5"
                    >
                      <FiCheck size={14} /> Mark Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default TodayAppointments;
