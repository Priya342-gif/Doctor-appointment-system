import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { addDoctorAPI } from '../../services/adminService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FiGrid, FiCalendar, FiUserCheck, FiUpload, FiPlus, FiX } from 'react-icons/fi';
import { FaUserMd, FaUserInjured } from 'react-icons/fa';
import { useForm } from 'react-hook-form';

const navItems = [
  { to: '/admin/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/admin/doctors', icon: FaUserMd, label: 'Doctors' },
  { to: '/admin/patients', icon: FaUserInjured, label: 'Patients' },
  { to: '/admin/appointments', icon: FiCalendar, label: 'Appointments' },
  { to: '/admin/add-doctor', icon: FiUserCheck, label: 'Add Doctor' },
];

const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const AddDoctor = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [availableDays, setAvailableDays] = useState([]);
  const [timeSlots, setTimeSlots] = useState([{ start: '09:00', end: '10:00' }]);
  const [newSlot, setNewSlot] = useState({ start: '', end: '' });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const toggleDay = (day) => {
    setAvailableDays((prev) => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const addSlot = () => {
    if (!newSlot.start || !newSlot.end) return;
    setTimeSlots((prev) => [...prev, newSlot]);
    setNewSlot({ start: '', end: '' });
  };

  const removeSlot = (i) => setTimeSlots((prev) => prev.filter((_, idx) => idx !== i));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => formData.append(k, v));
      formData.append('availableDays', JSON.stringify(availableDays));
      formData.append('availableTimeSlots', JSON.stringify(timeSlots));
      if (imageFile) formData.append('image', imageFile);

      await addDoctorAPI(formData);
      toast.success('Doctor added successfully!');
      navigate('/admin/doctors');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add doctor');
    } finally {
      setLoading(false);
    }
  };

  const required = { required: 'This field is required' };

  return (
    <DashboardLayout navItems={navItems} title="Add New Doctor">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Profile Image */}
          <div className="card text-center">
            <div className="relative inline-block mb-3">
              <img
                src={imagePreview || `https://ui-avatars.com/api/?name=New+Doctor&background=3b82f6&color=fff&size=100`}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-100 mx-auto"
              />
            </div>
            <label className="btn-secondary text-sm cursor-pointer inline-flex items-center gap-2">
              <FiUpload size={16} /> Upload Photo
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>

          {/* Personal Info */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input {...register('name', required)} className="input-field" placeholder="Dr. John Smith" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input {...register('email', { required: true, pattern: /\S+@\S+\.\S+/ })} type="email" className="input-field" placeholder="doctor@email.com" />
                {errors.email && <p className="text-red-500 text-xs mt-1">Valid email required</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <input {...register('password', { required: true, minLength: 6 })} type="password" className="input-field" placeholder="Min 6 chars" />
                {errors.password && <p className="text-red-500 text-xs mt-1">Min 6 characters</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input {...register('phone')} className="input-field" placeholder="+1 234 567 8900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input {...register('age')} type="number" className="input-field" placeholder="35" />
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
                <input {...register('specialization', required)} className="input-field" placeholder="Cardiologist" />
                {errors.specialization && <p className="text-red-500 text-xs mt-1">{errors.specialization.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qualification *</label>
                <input {...register('qualification', required)} className="input-field" placeholder="MBBS, MD" />
                {errors.qualification && <p className="text-red-500 text-xs mt-1">{errors.qualification.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years) *</label>
                <input {...register('experience', required)} type="number" className="input-field" placeholder="10" />
                {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee ($) *</label>
                <input {...register('consultationFee', required)} type="number" className="input-field" placeholder="500" />
                {errors.consultationFee && <p className="text-red-500 text-xs mt-1">{errors.consultationFee.message}</p>}
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name *</label>
                <input {...register('hospitalName', required)} className="input-field" placeholder="City Medical Center" />
                {errors.hospitalName && <p className="text-red-500 text-xs mt-1">{errors.hospitalName.message}</p>}
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input {...register('address')} className="input-field" placeholder="123 Medical Plaza" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
                <textarea {...register('about')} rows={4} className="input-field resize-none" placeholder="Brief description of the doctor..." />
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Availability</h3>
            <p className="text-sm font-medium text-gray-700 mb-2">Available Days</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {allDays.map((day) => (
                <button key={day} type="button" onClick={() => toggleDay(day)}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${availableDays.includes(day) ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:border-blue-300'}`}>
                  {day}
                </button>
              ))}
            </div>

            <p className="text-sm font-medium text-gray-700 mb-2">Time Slots</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {timeSlots.map((slot, i) => (
                <div key={i} className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-sm">
                  <span>{slot.start} – {slot.end}</span>
                  <button type="button" onClick={() => removeSlot(i)}><FiX size={14} /></button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 items-end flex-wrap">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Start</label>
                <input type="time" value={newSlot.start} onChange={(e) => setNewSlot((p) => ({ ...p, start: e.target.value }))} className="input-field text-sm w-32" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">End</label>
                <input type="time" value={newSlot.end} onChange={(e) => setNewSlot((p) => ({ ...p, end: e.target.value }))} className="input-field text-sm w-32" />
              </div>
              <button type="button" onClick={addSlot} className="btn-secondary flex items-center gap-1 text-sm h-10">
                <FiPlus size={16} /> Add Slot
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => navigate('/admin/doctors')} className="btn-secondary flex-1 py-3">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 py-3 text-base">
              {loading ? 'Adding Doctor...' : 'Add Doctor'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddDoctor;
