const mongoose = require('mongoose');

const seedLogSchema = mongoose.Schema({
  id: Number,
  status_code: Number,
  message: String,
  createdAt: { type: Date, default: Date.now },
});

const SeedLog = mongoose.model('seedLog', seedLogSchema);

module.exports = SeedLog;
