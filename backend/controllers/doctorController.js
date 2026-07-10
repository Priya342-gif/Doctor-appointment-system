const asyncHandler = require('express-async-handler');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

// @desc    Get all doctors with filters
// @route   GET /api/doctors
// @access  Public
const getDoctors = asyncHandler(async (req, res) => {
  const { search, specialization, minFee, maxFee, minExp, availability, page = 1, limit = 10 } = req.query;

  const userFilter = { role: 'doctor', isActive: true };
  const doctorFilter = { isApproved: true };

  if (specialization) doctorFilter.specialization = { $regex: specialization, $options: 'i' };
  if (minFee) doctorFilter.consultationFee = { ...doctorFilter.consultationFee, $gte: Number(minFee) };
  if (maxFee) doctorFilter.consultationFee = { ...doctorFilter.consultationFee, $lte: Number(maxFee) };
  if (minExp) doctorFilter.experience = { $gte: Number(minExp) };
  if (availability) doctorFilter.availableDays = { $in: [availability] };

  let userIds = null;
  if (search) {
    const users = await User.find({
      role: 'doctor',
      isActive: true,
      name: { $regex: search, $options: 'i' },
    }).select('_id');
    userIds = users.map((u) => u._id);
    doctorFilter.user = { $in: userIds };
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Doctor.countDocuments(doctorFilter);
  const doctors = await Doctor.find(doctorFilter)
    .populate('user', 'name email phone gender age profileImage')
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: doctors,
    pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
  });
});

// @desc    Get single doctor
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id).populate('user', 'name email phone gender age profileImage address');
  if (!doctor) { res.status(404); throw new Error('Doctor not found'); }
  res.json({ success: true, data: doctor });
});

// @desc    Get doctor profile (by logged-in doctor)
// @route   GET /api/doctors/profile/me
// @access  Private/Doctor
const getDoctorProfile = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ user: req.user._id }).populate('user', 'name email phone gender age profileImage address');
  if (!doctor) { res.status(404); throw new Error('Doctor profile not found'); }
  res.json({ success: true, data: doctor });
});

// @desc    Update doctor profile
// @route   PUT /api/doctors/profile/me
// @access  Private/Doctor
const updateDoctorProfile = asyncHandler(async (req, res) => {
  const { specialization, qualification, experience, hospitalName, consultationFee,
    address, about, availableDays, availableTimeSlots, name, phone, gender, age } = req.body;

  // Update user fields
  await User.findByIdAndUpdate(req.user._id, { name, phone, gender, age, address });

  // Update doctor fields
  const doctor = await Doctor.findOneAndUpdate(
    { user: req.user._id },
    { specialization, qualification, experience, hospitalName, consultationFee, address, about, availableDays, availableTimeSlots },
    { new: true, runValidators: true }
  ).populate('user', 'name email phone gender age profileImage address');

  if (!doctor) { res.status(404); throw new Error('Doctor profile not found'); }
  res.json({ success: true, message: 'Profile updated', data: doctor });
});

// @desc    Update doctor profile image
// @route   PUT /api/doctors/profile/image
// @access  Private/Doctor
const updateDoctorImage = asyncHandler(async (req, res) => {
  if (!req.file) { res.status(400); throw new Error('Please upload an image'); }
  const user = await User.findByIdAndUpdate(req.user._id, { profileImage: req.file.path }, { new: true });
  res.json({ success: true, message: 'Profile image updated', data: { profileImage: user.profileImage } });
});

// @desc    Get all specializations
// @route   GET /api/doctors/specializations
// @access  Public
const getSpecializations = asyncHandler(async (req, res) => {
  const specs = await Doctor.distinct('specialization');
  res.json({ success: true, data: specs });
});

module.exports = { getDoctors, getDoctorById, getDoctorProfile, updateDoctorProfile, updateDoctorImage, getSpecializations };
