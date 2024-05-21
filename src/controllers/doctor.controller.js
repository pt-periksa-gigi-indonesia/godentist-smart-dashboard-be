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

module.exports = {
  getDoctors,
  getDoctorById,
  verifyDoctor,
};
