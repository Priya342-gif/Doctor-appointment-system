import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { registerAPI } from '../../services/authService';
import { FaHeartbeat } from 'react-icons/fa';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Clean up optional fields before sending so empty strings aren't sent
      const payload = {
        name: data.name?.trim(),
        email: data.email?.trim(),
        password: data.password,
      };
      if (data.phone && data.phone.trim()) payload.phone = data.phone.trim();
      if (data.age && !isNaN(Number(data.age))) payload.age = Number(data.age);
      if (data.gender && data.gender.trim()) payload.gender = data.gender.trim();
      if (data.address && data.address.trim()) payload.address = data.address.trim();

      const res = await registerAPI(payload);
      login(res.data.data);
      toast.success('Registration successful!');
      navigate('/patient/dashboard');
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        (err.message === 'Network Error'
          ? 'Network / CORS error: Unable to connect to server. Please check your backend deployment.'
          : 'Registration failed');
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <FaHeartbeat className="text-blue-600 text-3xl" />
            <span className="text-2xl font-bold text-gray-800">Doc<span className="text-blue-600">Book</span></span>
          </Link>
          <h2 className="text-2xl font-bold text-gray-800 mt-4">Create Account</h2>
          <p className="text-gray-500 mt-1">Join DocBook as a patient</p>
        </div>

        <div className="card shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input {...register('name', { required: 'Name is required' })} placeholder="John Smith" className="input-field" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input {...register('email', { required: 'Email required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })} type="email" placeholder="your@email.com" className="input-field" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <div className="relative">
                  <input {...register('password', { required: 'Password required', minLength: { value: 6, message: 'Min 6 chars' } })} type={showPass ? 'text' : 'password'} placeholder="••••••••" className="input-field pr-10" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPass ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input {...register('phone')} placeholder="+1 234 567 8900" className="input-field" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input {...register('age', { min: { value: 1, message: 'Invalid age' } })} type="number" placeholder="25" className="input-field" />
                {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>}
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
                <input {...register('address')} placeholder="City, State" className="input-field" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base mt-2">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-gray-500 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 font-medium hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
