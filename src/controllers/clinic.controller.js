const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { clinicService } = require('../services');

const getClinics = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'id']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await clinicService.queryClinicHistories(filter, options);
  res.send(result);
});

const getClinic = catchAsync(async (req, res) => {
  const clinic = await clinicService.getClinicById(req.params.clinicId);
  if (!clinic || clinic.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Clinic not found');
  }
  res.send(clinic);
});

module.exports = {
  getClinics,
  getClinic,
};
