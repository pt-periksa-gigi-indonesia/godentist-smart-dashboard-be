const mongoose = require('mongoose');

const feedbackSchema = mongoose.Schema({
  id: Number,
  name: String,
  feedBackDoctor: mongoose.Schema.Types.Mixed,
});

/**
 * @typedef Feedbacks
 */
const Feedback = mongoose.model('feedbacks', feedbackSchema);

module.exports = Feedback;
