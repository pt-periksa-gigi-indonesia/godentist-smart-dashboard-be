const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  idDoctor: Number,
  doctorName: String,
  cardUrl: String,
  strNumber: String,
  verificationStatus: String,
});

/**
 * @typedef Profile
 */
const Profile = mongoose.model('profiles', profileSchema);

module.exports = Profile;
