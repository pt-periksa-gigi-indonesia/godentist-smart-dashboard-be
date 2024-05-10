const mongoose = require('mongoose');

const feedbackSchema = mongoose.Schema({
  id: Number,
  name: String,
  feedBackDoctor: Array,
});

/**
 * @typedef Feedbacks
 */
const Feedback = mongoose.model('feedbacks', feedbackSchema);

module.exports = Feedback;
