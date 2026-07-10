import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { getTodayAppointmentsAPI, getDoctorAppointmentsAPI } from '../../services/appointmentService';
import StatusBadge from '../../components/common/StatusBadge';
import Spinner from '../../components/common/Spinner';
import { FiCalendar, FiUser, FiGrid, FiClock } from 'react-icons/fi';
import { FaUserInjured, FaCalendarDay, FaCalendarCheck, FaHourglass } from 'react-icons/fa';

const navItems = [
  { to: '/doctor/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/doctor/today', icon: FiClock, label: "Today's Appointments" },
  { to: '/doctor/appointments', icon: FiCalendar, label: 'All Appointments' },
  { to: '/doctor/profile', icon: FiUser, label: 'My Profile' },
];

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [todayApts, setTodayApts] = useState([]);
  const [allStats, setAllStats] = useState({ total: 0, pending: 0, completed: 0, accepted: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getTodayAppointmentsAPI(), getDoctorAppointmentsAPI({ limit: 100 })])
      .then(([todayRes, allRes]) => {
        setTodayApts(todayRes.data.data);
        const all = allRes.data.data;
        setAllStats({
          total: allRes.data.pagination.total,
          pending: all.filter(a => a.status === 'pending').length,
          completed: all.filter(a => a.status === 'completed').length,
          accepted: all.filter(a => a.status === 'accepted').length,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "Today's Appointments", value: todayApts.length, icon: FaCalendarDay, color: 'bg-blue-50 text-blue-600' },
    { label: 'Pending', value: allStats.pending, icon: FaHourglass, color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Accepted', value: allStats.accepted, icon: FaCalendarCheck, color: 'bg-green-50 text-green-600' },
    { label: 'Total Patients', value: allStats.total, icon: FaUserInjured, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <DashboardLayout navItems={navItems} title="Doctor Dashboard">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white mb-6">
        <h2 className="text-2xl font-bold">Welcome, {user?.name?.split(' ')[0]}! 👨‍⚕️</h2>
        <p className="text-blue-100 mt-1">Manage your appointments and patient consultations</p>
      </div>

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

      {/* Today's Appointments */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 mb-5">Today's Appointments</h3>
        {loading ? <Spinner size="sm" /> : todayApts.length === 0 ? (
          <div className="text-center py-10">
            <FiCalendar className="mx-auto text-gray-300 mb-3" size={40} />
            <p className="text-gray-500">No appointments today</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayApts.map((apt) => (
              <div key={apt._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <img src={apt.patient?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(apt.patient?.name || 'P')}&background=10b981&color=fff`}
                    alt="" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-medium text-gray-800">{apt.patient?.name}</p>
                    <p className="text-xs text-gray-500">{apt.appointmentTime}</p>
                  </div>
                </div>
                <StatusBadge status={apt.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
