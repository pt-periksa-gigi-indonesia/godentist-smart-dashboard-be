const mongoose = require('mongoose');

const clinicFeedbackSchema = mongoose.Schema({
  id: Number,
  name: String,
  FeedBackClinic: mongoose.Schema.Types.Mixed,
});

/**
 * @typedef ClinicFeedbacks
 */
const ClinicFeedback = mongoose.model('clinicFeedbacks', clinicFeedbackSchema);

module.exports = ClinicFeedback;
