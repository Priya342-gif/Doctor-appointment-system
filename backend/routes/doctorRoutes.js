const express = require('express');
const router = express.Router();
const { getDoctors, getDoctorById, getDoctorProfile, updateDoctorProfile, updateDoctorImage, getSpecializations } = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.get('/', getDoctors);
router.get('/specializations', getSpecializations);
router.get('/profile/me', protect, authorize('doctor'), getDoctorProfile);
router.put('/profile/me', protect, authorize('doctor'), updateDoctorProfile);
router.put('/profile/image', protect, authorize('doctor'), upload.single('image'), updateDoctorImage);
router.get('/:id', getDoctorById);

module.exports = router;
