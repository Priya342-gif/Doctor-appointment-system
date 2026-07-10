import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { getPatientAppointmentsAPI } from '../../services/appointmentService';
import StatusBadge from '../../components/common/StatusBadge';
import Spinner from '../../components/common/Spinner';
import { Link } from 'react-router-dom';
import { FiCalendar, FiUser, FiSearch, FiGrid } from 'react-icons/fi';
import { FaCalendarCheck, FaCalendarTimes, FaCalendarAlt, FaCalendarPlus } from 'react-icons/fa';

const navItems = [
  { to: '/patient/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/patient/profile', icon: FiUser, label: 'My Profile' },
  { to: '/patient/appointments', icon: FiCalendar, label: 'My Appointments' },
  { to: '/doctors', icon: FiSearch, label: 'Find Doctors' },
];

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({ upcoming: 0, completed: 0, cancelled: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPatientAppointmentsAPI({ limit: 5 })
      .then((res) => {
        const data = res.data.data;
        setAppointments(data);
        setStats({
          upcoming: data.filter(a => a.status === 'accepted').length,
          completed: data.filter(a => a.status === 'completed').length,
          cancelled: data.filter(a => a.status === 'cancelled').length,
          pending: data.filter(a => a.status === 'pending').length,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Upcoming', value: stats.upcoming, icon: FaCalendarCheck, color: 'bg-green-50 text-green-600' },
    { label: 'Pending', value: stats.pending, icon: FaCalendarAlt, color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Completed', value: stats.completed, icon: FaCalendarPlus, color: 'bg-blue-50 text-blue-600' },
    { label: 'Cancelled', value: stats.cancelled, icon: FaCalendarTimes, color: 'bg-red-50 text-red-600' },
  ];

  return (
    <DashboardLayout navItems={navItems} title="Patient Dashboard">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white mb-6">
        <h2 className="text-2xl font-bold">Good day, {user?.name?.split(' ')[0]}! 👋</h2>
        <p className="text-blue-100 mt-1">Manage your appointments and health records</p>
        <Link to="/doctors" className="inline-block mt-4 bg-white text-blue-600 px-5 py-2 rounded-xl font-semibold text-sm hover:bg-blue-50 transition-colors">
          Book New Appointment
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${color}`}>
              <Icon size={20} />
            </div>
            <div className="text-2xl font-bold text-gray-800">{value}</div>
            <div className="text-gray-500 text-sm">{label}</div>
          </div>
        ))}
      </div>

      {/* Recent Appointments */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-800">Recent Appointments</h3>
          <Link to="/patient/appointments" className="text-blue-600 text-sm hover:underline">View All</Link>
        </div>

        {loading ? <Spinner size="sm" /> : appointments.length === 0 ? (
          <div className="text-center py-10">
            <FiCalendar className="mx-auto text-gray-300 mb-3" size={40} />
            <p className="text-gray-500">No appointments yet</p>
            <Link to="/doctors" className="btn-primary mt-3 inline-block text-sm">Book Now</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="text-left pb-3 font-medium">Doctor</th>
                  <th className="text-left pb-3 font-medium">Date</th>
                  <th className="text-left pb-3 font-medium">Time</th>
                  <th className="text-left pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {appointments.map((apt) => (
                  <tr key={apt._id} className="hover:bg-gray-50">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <img src={apt.doctor?.user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(apt.doctor?.user?.name || 'Dr')}&background=3b82f6&color=fff`}
                          alt="" className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <p className="font-medium text-gray-800">{apt.doctor?.user?.name}</p>
                          <p className="text-xs text-gray-500">{apt.doctor?.specialization}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-gray-600">{new Date(apt.appointmentDate).toLocaleDateString()}</td>
                    <td className="py-3 text-gray-600">{apt.appointmentTime}</td>
                    <td className="py-3"><StatusBadge status={apt.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;
