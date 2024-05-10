const mongoose = require('mongoose');

const doctorSchema = mongoose.Schema({
  id: Number,
  name: String,
  photo: String,
  specialization: String,
  workPlace: String,
  consultationPrice: String,
  DoctorWorkSchedule: mongoose.Schema.Types.Mixed,
  DoctorExperience: mongoose.Schema.Types.Mixed,
});

/**
 * @typedef Doctor
 */
const Doctor = mongoose.model('doctors', doctorSchema);

module.exports = Doctor;
