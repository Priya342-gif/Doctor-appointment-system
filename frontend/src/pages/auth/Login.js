import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { loginAPI } from '../../services/authService';
import { FaHeartbeat } from 'react-icons/fa';
import { FiEye, FiEyeOff, FiMail, FiLock } from 'react-icons/fi';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await loginAPI({
        email: data.email?.trim(),
        password: data.password,
      });
      login(res.data.data);
      toast.success(`Welcome back, ${res.data.data.name}!`);
      const redirectMap = { admin: '/admin/dashboard', doctor: '/doctor/dashboard', patient: '/patient/dashboard' };
      navigate(redirectMap[res.data.data.role] || '/');
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        (err.message === 'Network Error'
          ? 'Network / CORS error: Unable to connect to server. Please check your backend deployment.'
          : 'Login failed');
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <FaHeartbeat className="text-blue-600 text-3xl" />
            <span className="text-2xl font-bold text-gray-800">Doc<span className="text-blue-600">Book</span></span>
          </Link>
          <h2 className="text-2xl font-bold text-gray-800 mt-4">Welcome Back</h2>
          <p className="text-gray-500 mt-1">Sign in to your account</p>
        </div>

        <div className="card shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })}
                  type="email"
                  placeholder="your@email.com"
                  className="input-field pl-10"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  {...register('password', { required: 'Password is required' })}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input-field pl-10 pr-10"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 font-medium hover:underline">Register here</Link>
            </p>
          </div>

          {/* Demo accounts */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-gray-600">
            <p className="font-semibold text-gray-700 mb-1">Demo Accounts:</p>
            <p>Admin: admin@docbook.com / admin123</p>
            <p>Patient: john@example.com / patient123</p>
            <p>Doctor: emily@docbook.com / doctor123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
