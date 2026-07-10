import React, { useEffect, useState, useRef } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { getDoctorProfileAPI, updateDoctorProfileAPI, updateDoctorImageAPI } from '../../services/doctorService';
import { toast } from 'react-toastify';
import { FiCalendar, FiUser, FiGrid, FiClock, FiCamera, FiSave, FiPlus, FiX } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import Spinner from '../../components/common/Spinner';

const navItems = [
  { to: '/doctor/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/doctor/today', icon: FiClock, label: "Today's Appointments" },
  { to: '/doctor/appointments', icon: FiCalendar, label: 'All Appointments' },
  { to: '/doctor/profile', icon: FiUser, label: 'My Profile' },
];

const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DoctorProfile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [availableDays, setAvailableDays] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [newSlot, setNewSlot] = useState({ start: '', end: '' });
  const fileRef = useRef();

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    getDoctorProfileAPI()
      .then((res) => {
        const d = res.data.data;
        reset({
          name: d.user?.name, phone: d.user?.phone, gender: d.user?.gender, age: d.user?.age,
          specialization: d.specialization, qualification: d.qualification, experience: d.experience,
          hospitalName: d.hospitalName, consultationFee: d.consultationFee, address: d.address, about: d.about,
        });
        setAvailableDays(d.availableDays || []);
        setTimeSlots(d.availableTimeSlots || []);
      })
      .finally(() => setLoading(false));
  }, [reset]);

  const toggleDay = (day) => {
    setAvailableDays((prev) => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const addSlot = () => {
    if (!newSlot.start || !newSlot.end) return;
    setTimeSlots((prev) => [...prev, newSlot]);
    setNewSlot({ start: '', end: '' });
  };

  const removeSlot = (i) => setTimeSlots((prev) => prev.filter((_, idx) => idx !== i));

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      await updateDoctorProfileAPI({ ...data, availableDays, availableTimeSlots: timeSlots });
      updateUser({ name: data.name });
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    setImgLoading(true);
    try {
      const res = await updateDoctorImageAPI(formData);
      updateUser({ profileImage: res.data.data.profileImage });
      toast.success('Profile image updated');
    } catch {
      toast.error('Image upload failed');
    } finally {
      setImgLoading(false);
    }
  };

  if (loading) return <DashboardLayout navItems={navItems} title="My Profile"><Spinner /></DashboardLayout>;

  return (
    <DashboardLayout navItems={navItems} title="My Profile">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Avatar */}
        <div className="card text-center">
          <div className="relative inline-block mb-4">
            <img
              src={user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Dr')}&background=3b82f6&color=fff&size=120`}
              alt={user?.name}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-100 mx-auto"
            />
            <button onClick={() => fileRef.current.click()} disabled={imgLoading}
              className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
              <FiCamera size={14} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
          <p className="text-blue-600 text-sm">{user?.email}</p>
          <span className="bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full mt-2 inline-block">Doctor</span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input {...register('name', { required: true })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input {...register('phone')} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input {...register('age')} type="number" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select {...register('gender')} className="input-field">
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Professional */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Professional Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization *</label>
                <input {...register('specialization', { required: true })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qualification *</label>
                <input {...register('qualification', { required: true })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years) *</label>
                <input {...register('experience', { required: true })} type="number" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee ($) *</label>
                <input {...register('consultationFee', { required: true })} type="number" className="input-field" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name *</label>
                <input {...register('hospitalName', { required: true })} className="input-field" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input {...register('address')} className="input-field" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
                <textarea {...register('about')} rows={4} className="input-field resize-none" />
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Availability</h3>
            <p className="text-sm text-gray-600 mb-3">Available Days</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {allDays.map((day) => (
                <button key={day} type="button" onClick={() => toggleDay(day)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${availableDays.includes(day) ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:border-blue-300'}`}>
                  {day}
                </button>
              ))}
            </div>

            <p className="text-sm text-gray-600 mb-3">Time Slots</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {timeSlots.map((slot, i) => (
                <div key={i} className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-sm">
                  <span>{slot.start} – {slot.end}</span>
                  <button type="button" onClick={() => removeSlot(i)} className="hover:text-red-500 ml-1"><FiX size={14} /></button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 items-end">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Start</label>
                <input type="time" value={newSlot.start} onChange={(e) => setNewSlot((p) => ({ ...p, start: e.target.value }))} className="input-field text-sm w-32" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">End</label>
                <input type="time" value={newSlot.end} onChange={(e) => setNewSlot((p) => ({ ...p, end: e.target.value }))} className="input-field text-sm w-32" />
              </div>
              <button type="button" onClick={addSlot} className="btn-secondary flex items-center gap-1 text-sm h-10">
                <FiPlus size={16} /> Add
              </button>
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 w-full justify-center py-3">
            <FiSave size={16} /> {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default DoctorProfile;
