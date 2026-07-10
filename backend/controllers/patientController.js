const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get patient profile
// @route   GET /api/patients/profile/me
// @access  Private/Patient
const getPatientProfile = asyncHandler(async (req, res) => {
  const patient = await User.findById(req.user._id);
  if (!patient) { res.status(404); throw new Error('Patient not found'); }
  res.json({ success: true, data: patient });
});

// @desc    Update patient profile
// @route   PUT /api/patients/profile/me
// @access  Private/Patient
const updatePatientProfile = asyncHandler(async (req, res) => {
  const { name, phone, age, gender, address } = req.body;
  const patient = await User.findByIdAndUpdate(
    req.user._id,
    { name, phone, age, gender, address },
    { new: true, runValidators: true }
  );
  res.json({ success: true, message: 'Profile updated', data: patient });
});

// @desc    Update patient profile image
// @route   PUT /api/patients/profile/image
// @access  Private/Patient
const updatePatientImage = asyncHandler(async (req, res) => {
  if (!req.file) { res.status(400); throw new Error('Please upload an image'); }
  const patient = await User.findByIdAndUpdate(req.user._id, { profileImage: req.file.path }, { new: true });
  res.json({ success: true, message: 'Profile image updated', data: { profileImage: patient.profileImage } });
});

// @desc    Get all patients (Admin)
// @route   GET /api/patients
// @access  Private/Admin
const getAllPatients = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  const filter = { role: 'patient' };
  if (search) filter.name = { $regex: search, $options: 'i' };

  const skip = (Number(page) - 1) * Number(limit);
  const total = await User.countDocuments(filter);
  const patients = await User.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 });

  res.json({
    success: true,
    data: patients,
    pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
  });
});

// @desc    Get single patient (Admin)
// @route   GET /api/patients/:id
// @access  Private/Admin
const getPatientById = asyncHandler(async (req, res) => {
  const patient = await User.findOne({ _id: req.params.id, role: 'patient' });
  if (!patient) { res.status(404); throw new Error('Patient not found'); }
  res.json({ success: true, data: patient });
});

module.exports = { getPatientProfile, updatePatientProfile, updatePatientImage, getAllPatients, getPatientById };
