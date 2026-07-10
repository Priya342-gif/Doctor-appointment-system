import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout';
import Spinner from '../../components/common/Spinner';
import { getDoctorByIdAPI } from '../../services/doctorService';
import { useAuth } from '../../context/AuthContext';
import { FiClock, FiDollarSign, FiMapPin, FiPhone, FiMail, FiCalendar, FiStar } from 'react-icons/fi';
import { FaGraduationCap, FaHospital } from 'react-icons/fa';

const DoctorDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDoctorByIdAPI(id)
      .then((res) => setDoctor(res.data.data))
      .catch(() => navigate('/doctors'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <PublicLayout><Spinner /></PublicLayout>;
  if (!doctor) return null;

  const { user: u, specialization, qualification, experience, hospitalName, consultationFee, address, about, availableDays, availableTimeSlots } = doctor;

  const handleBook = () => {
    if (!user) return navigate('/login');
    if (user.role !== 'patient') return;
    navigate(`/patient/book/${doctor._id}`);
  };

  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Profile Header */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={u?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(u?.name || 'Dr')}&background=3b82f6&color=fff&size=150`}
              alt={u?.name}
              className="w-32 h-32 rounded-2xl object-cover ring-4 ring-blue-100 mx-auto md:mx-0"
            />
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{u?.name}</h1>
                  <p className="text-blue-600 font-medium text-lg">{specialization}</p>
                  <div className="flex items-center gap-1 text-yellow-500 mt-1">
                    {[...Array(5)].map((_, i) => <FiStar key={i} className="fill-current" size={16} />)}
                    <span className="text-gray-600 text-sm ml-1">(4.8 · 120 reviews)</span>
                  </div>
                </div>
                <button onClick={handleBook} className="btn-primary px-8 py-3 text-base">
                  Book Appointment
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
                {[
                  { icon: FiClock, label: 'Experience', val: `${experience} Years` },
                  { icon: FiDollarSign, label: 'Fee', val: `$${consultationFee}` },
                  { icon: FaHospital, label: 'Hospital', val: hospitalName },
                  { icon: FaGraduationCap, label: 'Qualification', val: qualification },
                ].map(({ icon: Icon, label, val }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="text-blue-500" size={14} />
                      <span className="text-xs text-gray-500">{label}</span>
                    </div>
                    <p className="font-semibold text-gray-800 text-sm truncate">{val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* About + Info */}
          <div className="md:col-span-2 space-y-6">
            {about && (
              <div className="card">
                <h2 className="text-lg font-bold text-gray-800 mb-3">About Doctor</h2>
                <p className="text-gray-600 leading-relaxed">{about}</p>
              </div>
            )}

            <div className="card">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Contact & Location</h2>
              <div className="space-y-3 text-sm text-gray-600">
                {u?.email && <div className="flex items-center gap-3"><FiMail className="text-blue-500" /><span>{u.email}</span></div>}
                {u?.phone && <div className="flex items-center gap-3"><FiPhone className="text-blue-500" /><span>{u.phone}</span></div>}
                {address && <div className="flex items-center gap-3"><FiMapPin className="text-blue-500" /><span>{address}</span></div>}
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Availability</h2>
              <div className="space-y-2">
                {availableDays?.map((day) => (
                  <div key={day} className="flex items-center gap-2">
                    <FiCalendar className="text-blue-500" size={14} />
                    <span className="text-sm text-gray-700">{day}</span>
                  </div>
                ))}
              </div>
            </div>

            {availableTimeSlots?.length > 0 && (
              <div className="card">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Time Slots</h2>
                <div className="flex flex-wrap gap-2">
                  {availableTimeSlots.map((slot, i) => (
                    <span key={i} className="bg-blue-50 text-blue-600 text-xs px-3 py-1.5 rounded-lg font-medium">
                      {slot.start} – {slot.end}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button onClick={handleBook} className="btn-primary w-full py-3 text-base">
              Book Appointment
            </button>
            {!user && <p className="text-xs text-center text-gray-500">Please <Link to="/login" className="text-blue-600 underline">login</Link> to book</p>}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default DoctorDetail;
