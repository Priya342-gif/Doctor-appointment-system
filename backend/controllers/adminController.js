const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const generateToken = require('../utils/generateToken');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const today = new Date(); today.setHours(0,0,0,0);
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);

  const [totalDoctors, totalPatients, todayAppointments, completedAppointments, pendingAppointments, totalAppointments] = await Promise.all([
    Doctor.countDocuments(),
    User.countDocuments({ role: 'patient' }),
    Appointment.countDocuments({ appointmentDate: { $gte: today, $lt: tomorrow } }),
    Appointment.countDocuments({ status: 'completed' }),
    Appointment.countDocuments({ status: 'pending' }),
    Appointment.countDocuments(),
  ]);

  res.json({
    success: true,
    data: { totalDoctors, totalPatients, todayAppointments, completedAppointments, pendingAppointments, totalAppointments },
  });
});

// @desc    Add doctor
// @route   POST /api/admin/doctors
// @access  Private/Admin
const addDoctor = asyncHandler(async (req, res) => {
  const { name, email, password, phone, gender, age, specialization, qualification,
    experience, hospitalName, consultationFee, address, about, availableDays, availableTimeSlots } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) { res.status(400); throw new Error('Email already registered'); }

  const user = await User.create({
    name, email, password, phone, gender, age, role: 'doctor',
    profileImage: req.file ? req.file.path : '',
  });

  const doctor = await Doctor.create({
    user: user._id, specialization, qualification, experience: Number(experience),
    hospitalName, consultationFee: Number(consultationFee), address, about,
    availableDays: Array.isArray(availableDays) ? availableDays : JSON.parse(availableDays || '[]'),
    availableTimeSlots: Array.isArray(availableTimeSlots) ? availableTimeSlots : JSON.parse(availableTimeSlots || '[]'),
  });

  const populated = await Doctor.findById(doctor._id).populate('user', 'name email phone gender age profileImage');
  res.status(201).json({ success: true, message: 'Doctor added successfully', data: populated });
});

// @desc    Edit doctor
// @route   PUT /api/admin/doctors/:id
// @access  Private/Admin
const editDoctor = asyncHandler(async (req, res) => {
  const { name, email, phone, gender, age, specialization, qualification, experience,
    hospitalName, consultationFee, address, about, availableDays, availableTimeSlots } = req.body;

  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) { res.status(404); throw new Error('Doctor not found'); }

  const updateUser = { name, email, phone, gender, age };
  if (req.file) updateUser.profileImage = req.file.path;
  await User.findByIdAndUpdate(doctor.user, updateUser);

  const updatedDoctor = await Doctor.findByIdAndUpdate(
    req.params.id,
    {
      specialization, qualification, experience: Number(experience), hospitalName,
      consultationFee: Number(consultationFee), address, about,
      availableDays: Array.isArray(availableDays) ? availableDays : JSON.parse(availableDays || '[]'),
      availableTimeSlots: Array.isArray(availableTimeSlots) ? availableTimeSlots : JSON.parse(availableTimeSlots || '[]'),
    },
    { new: true }
  ).populate('user', 'name email phone gender age profileImage');

  res.json({ success: true, message: 'Doctor updated', data: updatedDoctor });
});

// @desc    Delete doctor
// @route   DELETE /api/admin/doctors/:id
// @access  Private/Admin
const deleteDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) { res.status(404); throw new Error('Doctor not found'); }
  await User.findByIdAndDelete(doctor.user);
  await Doctor.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Doctor deleted successfully' });
});

// @desc    Get all doctors (Admin)
// @route   GET /api/admin/doctors
// @access  Private/Admin
const getAllDoctors = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  const doctorFilter = {};

  if (search) {
    const users = await User.find({ role: 'doctor', name: { $regex: search, $options: 'i' } }).select('_id');
    doctorFilter.user = { $in: users.map(u => u._id) };
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Doctor.countDocuments(doctorFilter);
  const doctors = await Doctor.find(doctorFilter)
    .populate('user', 'name email phone gender age profileImage isActive')
    .skip(skip).limit(Number(limit)).sort({ createdAt: -1 });

  res.json({ success: true, data: doctors, pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) } });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  if (user.role === 'admin') { res.status(400); throw new Error('Cannot delete admin'); }
  if (user.role === 'doctor') {
    await Doctor.findOneAndDelete({ user: user._id });
  }
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'User deleted' });
});

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle
// @access  Private/Admin
const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  user.isActive = !user.isActive;
  await user.save();
  res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, data: { isActive: user.isActive } });
});

module.exports = { getDashboardStats, addDoctor, editDoctor, deleteDoctor, getAllDoctors, deleteUser, toggleUserStatus };
