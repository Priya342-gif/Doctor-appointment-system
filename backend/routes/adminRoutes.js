const express = require('express');
const router = express.Router();
const { getDashboardStats, addDoctor, editDoctor, deleteDoctor, getAllDoctors, deleteUser, toggleUserStatus } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.use(protect, authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/doctors', getAllDoctors);
router.post('/doctors', upload.single('image'), addDoctor);
router.put('/doctors/:id', upload.single('image'), editDoctor);
router.delete('/doctors/:id', deleteDoctor);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/toggle', toggleUserStatus);

module.exports = router;
