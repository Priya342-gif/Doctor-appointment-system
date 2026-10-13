const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const generateToken = require('../utils/generateToken');

// @desc    Register patient
// @route   POST /api/auth/register or /auth/register
// @access  Public
const registerPatient = asyncHandler(async (req, res) => {
  const { name, email, password, phone, age, gender, address } = req.body;

  const normalizedEmail = email ? email.trim().toLowerCase() : '';

  const userExists = await User.findOne({ email: normalizedEmail });
  if (userExists) {
    res.status(400);
    throw new Error('Email already registered');
  }

  // Sanitize fields so empty strings from form don't fail Mongoose schema enums/types
  const userData = {
    name: name ? name.trim() : '',
    email: normalizedEmail,
    password,
    role: 'patient',
  };

  if (phone && phone.trim()) userData.phone = phone.trim();
  if (age !== undefined && age !== null && age !== '') {
    const parsedAge = Number(age);
    if (!isNaN(parsedAge) && parsedAge > 0) userData.age = parsedAge;
  }
  if (gender && ['male', 'female', 'other'].includes(gender)) {
    userData.gender = gender;
  }
  if (address && address.trim()) userData.address = address.trim();

  const user = await User.create(userData);

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    },
  });
});

// @desc    Login user (patient/doctor/admin)
// @route   POST /api/auth/login or /auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email ? email.trim().toLowerCase() : '';

  const user = await User.findOne({ email: normalizedEmail });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error('Account has been deactivated');
  }

  let doctorProfile = null;
  if (user.role === 'doctor') {
    doctorProfile = await Doctor.findOne({ user: user._id });
  }

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      phone: user.phone,
      gender: user.gender,
      age: user.age,
      address: user.address,
      doctorProfile: doctorProfile ? doctorProfile._id : null,
      token: generateToken(user._id),
    },
  });
});

// @desc    Get current user profile
// @route   GET /api/auth/me or /auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  let doctorProfile = null;
  if (user.role === 'doctor') {
    doctorProfile = await Doctor.findOne({ user: user._id });
  }
  res.json({ success: true, data: { ...user.toJSON(), doctorProfile } });
});

// @desc    Update password
// @route   PUT /api/auth/update-password or /auth/update-password
// @access  Private
const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  if (!(await user.matchPassword(currentPassword))) {
    res.status(400);
    throw new Error('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: 'Password updated successfully' });
});

module.exports = { registerPatient, loginUser, getMe, updatePassword };
