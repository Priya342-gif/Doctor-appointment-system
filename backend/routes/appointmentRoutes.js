const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  bookAppointment, getPatientAppointments, getDoctorAppointments, getTodayAppointments,
  updateAppointmentStatus, cancelAppointment, getAllAppointments
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

router.post('/', protect, authorize('patient'), [
  body('doctorId').notEmpty().withMessage('Doctor is required'),
  body('appointmentDate').notEmpty().withMessage('Date is required'),
  body('appointmentTime').notEmpty().withMessage('Time is required'),
], validate, bookAppointment);

router.get('/patient', protect, authorize('patient'), getPatientAppointments);
router.get('/doctor', protect, authorize('doctor'), getDoctorAppointments);
router.get('/doctor/today', protect, authorize('doctor'), getTodayAppointments);
router.get('/', protect, authorize('admin'), getAllAppointments);
router.put('/:id', protect, updateAppointmentStatus);
router.delete('/:id', protect, authorize('patient'), cancelAppointment);

module.exports = router;
