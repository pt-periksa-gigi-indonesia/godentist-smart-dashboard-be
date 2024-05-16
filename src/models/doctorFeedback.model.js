const mongoose = require('mongoose');

const doctorFeedbackSchema = mongoose.Schema({
  id: Number,
  name: String,
  feedBackDoctor: mongoose.Schema.Types.Mixed,
});

/**
 * @typedef DoctorFeedbacks
 */
const DoctorFeedback = mongoose.model('doctorfeedbacks', doctorFeedbackSchema);

module.exports = DoctorFeedback;
