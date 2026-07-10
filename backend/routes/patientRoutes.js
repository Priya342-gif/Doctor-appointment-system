const express = require('express');
const router = express.Router();
const { getPatientProfile, updatePatientProfile, updatePatientImage, getAllPatients, getPatientById } = require('../controllers/patientController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.get('/profile/me', protect, authorize('patient'), getPatientProfile);
router.put('/profile/me', protect, authorize('patient'), updatePatientProfile);
router.put('/profile/image', protect, authorize('patient'), upload.single('image'), updatePatientImage);
router.get('/', protect, authorize('admin'), getAllPatients);
router.get('/:id', protect, authorize('admin'), getPatientById);

module.exports = router;
