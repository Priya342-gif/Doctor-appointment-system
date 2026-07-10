import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import Spinner from '../../components/common/Spinner';
import { getDoctorByIdAPI } from '../../services/doctorService';
import { bookAppointmentAPI } from '../../services/appointmentService';
import { toast } from 'react-toastify';
import { FiCalendar, FiUser, FiSearch, FiGrid, FiClock, FiDollarSign } from 'react-icons/fi';

const navItems = [
  { to: '/patient/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/patient/profile', icon: FiUser, label: 'My Profile' },
  { to: '/patient/appointments', icon: FiCalendar, label: 'My Appointments' },
  { to: '/doctors', icon: FiSearch, label: 'Find Doctors' },
];

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookLoading, setBookLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    getDoctorByIdAPI(doctorId)
      .then((res) => setDoctor(res.data.data))
      .catch(() => navigate('/doctors'))
      .finally(() => setLoading(false));
  }, [doctorId, navigate]);

  const handleBook = async () => {
    if (!selectedDate || !selectedTime) return toast.error('Please select date and time');
    setBookLoading(true);
    try {
      await bookAppointmentAPI({ doctorId, appointmentDate: selectedDate, appointmentTime: selectedTime, notes });
      toast.success('Appointment booked successfully!');
      navigate('/patient/appointments');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBookLoading(false);
    }
  };

  // Generate available dates (next 30 days matching doctor's available days)
  const getAvailableDates = () => {
    if (!doctor?.availableDays?.length) return [];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      if (doctor.availableDays.includes(days[d.getDay()])) {
        dates.push(d.toISOString().split('T')[0]);
      }
    }
    return dates;
  };

  if (loading) return <DashboardLayout navItems={navItems} title="Book Appointment"><Spinner /></DashboardLayout>;

  return (
    <DashboardLayout navItems={navItems} title="Book Appointment">
      <div className="max-w-2xl mx-auto">
        {/* Doctor Info */}
        <div className="card mb-6">
          <div className="flex items-center gap-4">
            <img
              src={doctor?.user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor?.user?.name || 'Dr')}&background=3b82f6&color=fff&size=80`}
              alt={doctor?.user?.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800">{doctor?.user?.name}</h3>
              <p className="text-blue-600">{doctor?.specialization}</p>
              <div className="flex gap-4 text-sm text-gray-500 mt-1">
                <span className="flex items-center gap-1"><FiClock size={12} /> {doctor?.experience} yrs exp</span>
                <span className="flex items-center gap-1"><FiDollarSign size={12} /> ${doctor?.consultationFee}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-5">Select Appointment</h3>

          {/* Date */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-40 overflow-y-auto">
              {getAvailableDates().map((date) => {
                const d = new Date(date);
                return (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`p-2 rounded-xl border text-center transition-colors ${selectedDate === date ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 hover:border-blue-300'}`}
                  >
                    <p className="text-xs text-current opacity-70">{d.toLocaleDateString('en', { month: 'short' })}</p>
                    <p className="font-bold">{d.getDate()}</p>
                    <p className="text-xs">{d.toLocaleDateString('en', { weekday: 'short' })}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slots */}
          {selectedDate && (
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
              <div className="flex flex-wrap gap-2">
                {doctor?.availableTimeSlots?.map((slot, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedTime(slot.start)}
                    className={`px-4 py-2 rounded-lg border text-sm transition-colors ${selectedTime === slot.start ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 hover:border-blue-300'}`}
                  >
                    {slot.start} – {slot.end}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Describe your symptoms or reason for visit..."
              className="input-field resize-none"
            />
          </div>

          {/* Summary */}
          {selectedDate && selectedTime && (
            <div className="bg-blue-50 rounded-xl p-4 mb-5 text-sm">
              <p className="font-semibold text-blue-800 mb-2">Appointment Summary</p>
              <div className="grid grid-cols-2 gap-2 text-gray-700">
                <span>Doctor:</span><span className="font-medium">{doctor?.user?.name}</span>
                <span>Date:</span><span className="font-medium">{new Date(selectedDate).toDateString()}</span>
                <span>Time:</span><span className="font-medium">{selectedTime}</span>
                <span>Fee:</span><span className="font-medium text-green-600">${doctor?.consultationFee}</span>
              </div>
            </div>
          )}

          <button
            onClick={handleBook}
            disabled={bookLoading || !selectedDate || !selectedTime}
            className="btn-primary w-full py-3 text-base"
          >
            {bookLoading ? 'Booking...' : 'Confirm Appointment'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BookAppointment;
