const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  start: { type: String, required: true },
  end: { type: String, required: true },
});

const doctorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    specialization: { type: String, required: true, trim: true },
    qualification: { type: String, required: true, trim: true },
    experience: { type: Number, required: true },
    hospitalName: { type: String, required: true, trim: true },
    consultationFee: { type: Number, required: true },
    address: { type: String, trim: true },
    about: { type: String },
    availableDays: {
      type: [String],
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      default: [],
    },
    availableTimeSlots: { type: [timeSlotSchema], default: [] },
    isApproved: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

doctorSchema.index({ specialization: 'text', hospitalName: 'text' });

module.exports = mongoose.model('Doctor', doctorSchema);
