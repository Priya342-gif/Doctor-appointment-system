const asyncHandler = require('express-async-handler');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const { appointmentBookedEmail, appointmentAcceptedEmail, appointmentCancelledEmail } = require('../utils/emailTemplates');

// @desc    Book appointment
// @route   POST /api/appointments
// @access  Private/Patient
const bookAppointment = asyncHandler(async (req, res) => {
  const { doctorId, appointmentDate, appointmentTime, notes } = req.body;

  const doctor = await Doctor.findById(doctorId).populate('user', 'name email');
  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }

  // Check for duplicate booking
  const existing = await Appointment.findOne({
    doctor: doctorId,
    appointmentDate: new Date(appointmentDate),
    appointmentTime,
    status: { $in: ['pending', 'accepted'] },
  });
  if (existing) {
    res.status(400);
    throw new Error('This time slot is already booked');
  }

  const appointment = await Appointment.create({
    patient: req.user._id,
    doctor: doctorId,
    appointmentDate: new Date(appointmentDate),
    appointmentTime,
    notes,
  });

  const populated = await Appointment.findById(appointment._id)
    .populate('patient', 'name email phone profileImage')
    .populate({ path: 'doctor', populate: { path: 'user', select: 'name email profileImage' } });

  // Send response immediately so the frontend never gets stuck on "Booking..."
  res.status(201).json({
    success: true,
    message: 'Appointment booked successfully',
    data: populated,
  });

  // Send email in the background without blocking the user response
  (async () => {
    try {
      const patient = await User.findById(req.user._id);
      const dateStr = new Date(appointmentDate).toDateString();
      const patientName = patient?.name || 'Patient';
      const doctorName = doctor?.user?.name || 'Doctor';

      if (patient?.email) {
        await sendEmail({
          to: patient.email,
          subject: 'Appointment Booked - DocBook',
          html: appointmentBookedEmail(patientName, doctorName, dateStr, appointmentTime),
        });
      }
    } catch (err) {
      console.error('Background booking email error:', err.message);
    }
  })();
});

// @desc    Get appointments for logged-in patient
// @route   GET /api/appointments/patient
// @access  Private/Patient
const getPatientAppointments = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const filter = { patient: req.user._id };
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Appointment.countDocuments(filter);
  const appointments = await Appointment.find(filter)
    .populate({ path: 'doctor', populate: { path: 'user', select: 'name email profileImage' } })
    .skip(skip)
    .limit(Number(limit))
    .sort({ appointmentDate: -1 });

  res.json({
    success: true,
    data: appointments,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

// @desc    Get appointments for logged-in doctor
// @route   GET /api/appointments/doctor
// @access  Private/Doctor
const getDoctorAppointments = asyncHandler(async (req, res) => {
  const { status, date, page = 1, limit = 10 } = req.query;
  const doctorProfile = await Doctor.findOne({ user: req.user._id });
  if (!doctorProfile) {
    res.status(404);
    throw new Error('Doctor profile not found');
  }

  const filter = { doctor: doctorProfile._id };
  if (status) filter.status = status;
  if (date) {
    const d = new Date(date);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    filter.appointmentDate = { $gte: d, $lt: next };
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Appointment.countDocuments(filter);
  const appointments = await Appointment.find(filter)
    .populate('patient', 'name email phone age gender profileImage address')
    .skip(skip)
    .limit(Number(limit))
    .sort({ appointmentDate: -1 });

  res.json({
    success: true,
    data: appointments,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

// @desc    Get today's appointments for doctor
// @route   GET /api/appointments/doctor/today
// @access  Private/Doctor
const getTodayAppointments = asyncHandler(async (req, res) => {
  const doctorProfile = await Doctor.findOne({ user: req.user._id });
  if (!doctorProfile) {
    res.status(404);
    throw new Error('Doctor profile not found');
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const appointments = await Appointment.find({
    doctor: doctorProfile._id,
    appointmentDate: { $gte: today, $lt: tomorrow },
    status: { $in: ['pending', 'accepted'] },
  }).populate('patient', 'name email phone age gender profileImage');

  res.json({ success: true, data: appointments });
});

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status, cancelReason } = req.body;
  const appointment = await Appointment.findById(req.params.id)
    .populate('patient', 'name email')
    .populate({ path: 'doctor', populate: { path: 'user', select: 'name email' } });

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  // Authorization
  const doctorProfile =
    req.user.role === 'doctor' ? await Doctor.findOne({ user: req.user._id }) : null;
  if (
    req.user.role === 'patient' &&
    appointment.patient._id.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error('Not authorized');
  }
  if (
    req.user.role === 'doctor' &&
    (!doctorProfile || doctorProfile._id.toString() !== appointment.doctor._id.toString())
  ) {
    res.status(403);
    throw new Error('Not authorized');
  }

  appointment.status = status;
  if (cancelReason) appointment.cancelReason = cancelReason;
  if (status === 'cancelled') appointment.cancelledBy = req.user.role;
  await appointment.save();

  // Send response immediately
  res.json({ success: true, message: `Appointment ${status}`, data: appointment });

  // Send email in background (non-blocking)
  (async () => {
    try {
      const dateStr = appointment.appointmentDate
        ? new Date(appointment.appointmentDate).toDateString()
        : '';
      const patientName = appointment.patient?.name || 'Patient';
      const doctorName = appointment.doctor?.user?.name || 'Doctor';
      const patientEmail = appointment.patient?.email;

      if (patientEmail) {
        if (status === 'accepted') {
          await sendEmail({
            to: patientEmail,
            subject: 'Appointment Accepted - DocBook',
            html: appointmentAcceptedEmail(
              patientName,
              doctorName,
              dateStr,
              appointment.appointmentTime
            ),
          });
        } else if (status === 'cancelled') {
          await sendEmail({
            to: patientEmail,
            subject: 'Appointment Cancelled - DocBook',
            html: appointmentCancelledEmail(
              patientName,
              doctorName,
              dateStr,
              cancelReason
            ),
          });
        }
      }
    } catch (err) {
      console.error('Background status email error:', err.message);
    }
  })();
});

// @desc    Cancel appointment (patient)
// @route   DELETE /api/appointments/:id
// @access  Private/Patient
const cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findOne({
    _id: req.params.id,
    patient: req.user._id,
  });
  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }
  if (['completed', 'cancelled'].includes(appointment.status)) {
    res.status(400);
    throw new Error('Cannot cancel this appointment');
  }
  appointment.status = 'cancelled';
  appointment.cancelledBy = 'patient';
  await appointment.save();
  res.json({ success: true, message: 'Appointment cancelled' });
});

// @desc    Get all appointments (Admin)
// @route   GET /api/appointments
// @access  Private/Admin
const getAllAppointments = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Appointment.countDocuments(filter);
  const appointments = await Appointment.find(filter)
    .populate('patient', 'name email phone profileImage')
    .populate({
      path: 'doctor',
      populate: { path: 'user', select: 'name email profileImage' },
    })
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: appointments,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

module.exports = {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  getTodayAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  getAllAppointments,
};
