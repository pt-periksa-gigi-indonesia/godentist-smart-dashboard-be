const mongoose = require('mongoose');
const { paginate } = require('./plugins');

const doctorFeedbackSchema = mongoose.Schema({
  id: Number,
  name: String,
  feedBackDoctor: mongoose.Schema.Types.Mixed,
});

doctorFeedbackSchema.plugin(paginate);

/**
 * @typedef DoctorFeedbacks
 */
const DoctorFeedback = mongoose.model('doctorfeedbacks', doctorFeedbackSchema);

module.exports = DoctorFeedback;
