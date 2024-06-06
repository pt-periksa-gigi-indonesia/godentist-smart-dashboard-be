const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { doctorService } = require('../services');

const getDoctors = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'verificationStatus', 'id']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await doctorService.queryDoctors(filter, options);
  res.send(result);
});

const getDoctorById = catchAsync(async (req, res) => {
  const doctor = await doctorService.getDoctorById(req.params.doctorId);
  res.send(doctor);
});

const verifyDoctor = catchAsync(async (req, res) => {
  const doctor = await doctorService.verifyDoctor(req.params.doctorId, req.body.verificationStatus);
  res.send({ message: 'Doctor verification status updated', doctor });
});

const ocrDoctorCard = catchAsync(async (req, res) => {
  const doctor = await doctorService.ocrDoctorCard(req.body.doctorId);
  res.send(doctor);
});

const ocrDoctorCardDB = catchAsync(async (req, res) => {
  const doctor = await doctorService.ocrDoctorCardDB(req.body.doctorId);
  res.send(doctor);
});

const editOcrDoctorCard = catchAsync(async (req, res) => {
  const { doctorId, ...newData } = req.body;
  const doctor = await doctorService.editOcrDoctorCard(doctorId, newData);
  res.send(doctor);
});

module.exports = {
  getDoctors,
  getDoctorById,
  verifyDoctor,
  ocrDoctorCard,
  ocrDoctorCardDB,
  editOcrDoctorCard,
};
