const mongoose = require('mongoose');

const doctorProfileSchema = new mongoose.Schema({
  idDoctor: Number,
  doctorName: String,
  cardUrl: String,
  strNumber: String,
  verificationStatus: String,
});

/**
 * @typedef doctorProfile
 */
const DoctorProfile = mongoose.model('doctorprofiles', doctorProfileSchema);

module.exports = DoctorProfile;
