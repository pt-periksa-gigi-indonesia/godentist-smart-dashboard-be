const mongoose = require('mongoose');

const consultationHistorySchema = new mongoose.Schema({
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
 * @typedef consultationHistory
 */
const ConsultationHistory = mongoose.model('consultationHistories', consultationHistorySchema);

module.exports = ConsultationHistory;
