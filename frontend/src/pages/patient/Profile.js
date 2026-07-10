import React, { useState, useRef } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { updatePatientProfile, updatePatientImage } from '../../services/patientService';
import { toast } from 'react-toastify';
import { FiUser, FiCalendar, FiSearch, FiGrid, FiCamera, FiSave } from 'react-icons/fi';
import { useForm } from 'react-hook-form';

const navItems = [
  { to: '/patient/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/patient/profile', icon: FiUser, label: 'My Profile' },
  { to: '/patient/appointments', icon: FiCalendar, label: 'My Appointments' },
  { to: '/doctors', icon: FiSearch, label: 'Find Doctors' },
];

const PatientProfile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const fileRef = useRef();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { name: user?.name, phone: user?.phone, age: user?.age, gender: user?.gender, address: user?.address },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await updatePatientProfile(data);
      updateUser(res.data.data);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    setImgLoading(true);
    try {
      const res = await updatePatientImage(formData);
      updateUser({ profileImage: res.data.data.profileImage });
      toast.success('Profile image updated');
    } catch {
      toast.error('Image upload failed');
    } finally {
      setImgLoading(false);
    }
  };

  return (
    <DashboardLayout navItems={navItems} title="My Profile">
      <div className="max-w-2xl mx-auto">
        {/* Avatar */}
        <div className="card mb-6 text-center">
          <div className="relative inline-block mb-4">
            <img
              src={user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=3b82f6&color=fff&size=120`}
              alt={user?.name}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-100 mx-auto"
            />
            <button
              onClick={() => fileRef.current.click()}
              disabled={imgLoading}
              className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
            >
              <FiCamera size={14} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
          <p className="text-gray-500 text-sm">{user?.email}</p>
          <span className="bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full mt-2 inline-block">Patient</span>
        </div>

        {/* Form */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-5">Edit Profile</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input {...register('name', { required: 'Name is required' })} className="input-field" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input {...register('phone')} className="input-field" placeholder="+1 234 567 8900" />
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input {...register('address')} className="input-field" placeholder="City, State" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              <FiSave size={16} /> {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientProfile;
