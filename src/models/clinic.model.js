const mongoose = require('mongoose');

const clinicHistorySchema = mongoose.Schema({
  id: Number,
  idPatient: Number,
  orderId: String,
  name: String,
  serviceDetails: mongoose.Schema.Types.Mixed,
  midtransResponse: mongoose.Schema.Types.Mixed,
  typeService: String,
  transactionStatus: String,
  createdAt: Date,
  updatedAt: Date,
});

/**
 * @typedef clinicHistory
 */
const ClinicHistory = mongoose.model('clinicHistories', clinicHistorySchema);

module.exports = ClinicHistory;
