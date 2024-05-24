const mongoose = require('mongoose');
const { paginate } = require('./plugins');

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

doctorSchema.plugin(paginate);

/**
 * @typedef Doctor
 */
const Doctor = mongoose.model('doctors', doctorSchema);

module.exports = Doctor;
