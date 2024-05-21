const mongoose = require('mongoose');
const { paginate } = require('./plugins');

const clinicFeedbackSchema = mongoose.Schema({
  id: Number,
  name: String,
  FeedBackClinic: mongoose.Schema.Types.Mixed,
});

clinicFeedbackSchema.plugin(paginate);

/**
 * @typedef ClinicFeedbacks
 */
const ClinicFeedback = mongoose.model('clinicFeedbacks', clinicFeedbackSchema);

module.exports = ClinicFeedback;
