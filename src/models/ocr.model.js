const mongoose = require('mongoose');

const ocrResultSchema = new mongoose.Schema({
  idDoctor: Number,
  encryptedData: String,
});

/**
 * @typedef ocrResult
 */
const OcrResult = mongoose.model('OcrResult', ocrResultSchema);

module.exports = OcrResult;
