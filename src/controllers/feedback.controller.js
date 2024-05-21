const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { feedbackService } = require('../services');

const getClinicFeedbacks = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'id', 'createdAt', 'feedback']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await feedbackService.queryClinicFeedbacks(filter, options);
  res.send(result);
});

const getDoctorFeedbacks = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'id', 'createdAt', 'feedback']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await feedbackService.queryDoctorFeedbacks(filter, options);
  res.send(result);
});

const getClinicFeedback = catchAsync(async (req, res) => {
  const clinic = await feedbackService.getClinicFeedbackById(req.params.clinicId);
  res.send(clinic);
});

const getDoctorFeedback = catchAsync(async (req, res) => {
  const doctor = await feedbackService.getDoctorFeedbackById(req.params.doctorId);
  res.send(doctor);
});

module.exports = {
  getClinicFeedbacks,
  getDoctorFeedbacks,
  getClinicFeedback,
  getDoctorFeedback,
};
