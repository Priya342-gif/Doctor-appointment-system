import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getDashboardStatsAPI } from '../../services/adminService';
import Spinner from '../../components/common/Spinner';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { FiGrid, FiUsers, FiCalendar, FiUserCheck, FiActivity } from 'react-icons/fi';
import { FaUserMd, FaUserInjured, FaCalendarCheck, FaCalendarAlt, FaHourglass } from 'react-icons/fa';

const navItems = [
  { to: '/admin/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/admin/doctors', icon: FaUserMd, label: 'Doctors' },
  { to: '/admin/patients', icon: FaUserInjured, label: 'Patients' },
  { to: '/admin/appointments', icon: FiCalendar, label: 'Appointments' },
  { to: '/admin/add-doctor', icon: FiUserCheck, label: 'Add Doctor' },
];

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStatsAPI()
      .then((res) => setStats(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Total Doctors', value: stats.totalDoctors, icon: FaUserMd, color: 'bg-blue-50 text-blue-600', link: '/admin/doctors' },
    { label: 'Total Patients', value: stats.totalPatients, icon: FaUserInjured, color: 'bg-green-50 text-green-600', link: '/admin/patients' },
    { label: "Today's Appointments", value: stats.todayAppointments, icon: FaCalendarAlt, color: 'bg-yellow-50 text-yellow-600', link: '/admin/appointments' },
    { label: 'Completed', value: stats.completedAppointments, icon: FaCalendarCheck, color: 'bg-purple-50 text-purple-600', link: '/admin/appointments?status=completed' },
    { label: 'Pending', value: stats.pendingAppointments, icon: FaHourglass, color: 'bg-orange-50 text-orange-600', link: '/admin/appointments?status=pending' },
    { label: 'Total Appointments', value: stats.totalAppointments, icon: FiActivity, color: 'bg-red-50 text-red-600', link: '/admin/appointments' },
  ] : [];

  return (
    <DashboardLayout navItems={navItems} title="Admin Dashboard">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white mb-6">
        <h2 className="text-2xl font-bold">Admin Panel 🔧</h2>
        <p className="text-blue-100 mt-1">Manage doctors, patients, and appointments</p>
      </div>

      {loading ? <Spinner /> : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {statCards.map(({ label, value, icon: Icon, color, link }) => (
            <Link key={label} to={link} className="card hover:shadow-md transition-shadow group">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                <Icon size={22} />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-1">{value}</div>
              <div className="text-gray-500 text-sm">{label}</div>
            </Link>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { to: '/admin/add-doctor', label: 'Add Doctor', color: 'bg-blue-600 hover:bg-blue-700' },
            { to: '/admin/doctors', label: 'Manage Doctors', color: 'bg-green-600 hover:bg-green-700' },
            { to: '/admin/patients', label: 'View Patients', color: 'bg-purple-600 hover:bg-purple-700' },
            { to: '/admin/appointments', label: 'Appointments', color: 'bg-orange-500 hover:bg-orange-600' },
          ].map(({ to, label, color }) => (
            <Link key={to} to={to} className={`${color} text-white text-center py-3 px-4 rounded-xl text-sm font-medium transition-colors`}>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
