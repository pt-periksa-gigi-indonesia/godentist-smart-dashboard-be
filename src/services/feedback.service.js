const httpStatus = require('http-status');
const { ClinicFeedback, DoctorFeedback } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Query for clinic feedbacks
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryClinicFeedbacks = async (filter, options) => {
  const pipeline = [
    {
      $project: {
        _id: 0,
        id: 1,
        name: 1,
        FeedBackClinic: 1,
      },
    },
  ];
  const clinicFeedbacks = await ClinicFeedback.paginate(pipeline, filter, options);
  return clinicFeedbacks;
};

/**
 * Query for doctor feedbacks
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryDoctorFeedbacks = async (filter, options) => {
  const pipeline = [
    {
      $project: {
        _id: 0,
        id: 1,
        name: 1,
        feedBackDoctor: 1,
      },
    },
  ];
  const doctorFeedbacks = await DoctorFeedback.paginate(pipeline, filter, options);
  return doctorFeedbacks;
};

/**
 * Get clinic feedback by id
 * @param {idClinic} id
 * @returns {Promise<Clinic>}
 */
const getClinicFeedbackById = async (id) => {
  const idClinic = parseInt(id, 10);
  const pipeline = [
    {
      $match: {
        id: idClinic,
      },
    },
    {
      $project: {
        _id: 0,
        id: 1,
        name: 1,
        feedBackDoctor: 1,
      },
    },
  ];
  const clinicFeedback = await ClinicFeedback.aggregate(pipeline);
  if (!clinicFeedback || clinicFeedback.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Clinic not found');
  }
  return clinicFeedback;
};

/**
 * Get doctor feedback by id
 * @param {idDoctor} id
 * @returns {Promise<Doctor>}
 */
const getDoctorFeedbackById = async (id) => {
  const doctorId = parseInt(id, 10);
  const pipeline = [
    {
      $match: {
        id: doctorId,
      },
    },
    {
      $project: {
        _id: 0,
        id: 1,
        name: 1,
        feedBackDoctor: 1,
      },
    },
  ];
  const doctorFeedback = await DoctorFeedback.aggregate(pipeline);
  if (!doctorFeedback || doctorFeedback.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Doctor not found');
  }
  return doctorFeedback;
};

module.exports = {
  queryClinicFeedbacks,
  queryDoctorFeedbacks,
  getClinicFeedbackById,
  getDoctorFeedbackById,
};