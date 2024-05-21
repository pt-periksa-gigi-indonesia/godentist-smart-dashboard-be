const httpStatus = require('http-status');
const axios = require('axios');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { doctorService } = require('../services');
const { api } = require('../config/config');

const getDoctors = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'verificationStatus', 'id']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await doctorService.queryDoctors(filter, options);
  res.send(result);
});

const getDoctorById = catchAsync(async (req, res) => {
  const doctor = await doctorService.getDoctorById(req.params.doctorId);
  if (!doctor || doctor.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Doctor not found');
  }
  res.send(doctor);
});

const verifyDoctor = catchAsync(async (req, res) => {
  const doctor = await doctorService.getDoctorById(req.params.doctorId);
  if (!doctor || doctor.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Doctor not found');
  }
  const doctorId = parseInt(req.params.doctorId, 10);
  const { verificationStatus } = req.body;
  const updateData = { verificationStatus };
  const headers = { 'x-api-key': api.key };
  const endpoint = `${api.verifyDoctor}/${doctorId}`;
  await axios.put(endpoint, updateData, { headers });
  res.send({ message: 'Doctor verification status updated' });
});

module.exports = {
  getDoctors,
  getDoctorById,
  verifyDoctor,
};
