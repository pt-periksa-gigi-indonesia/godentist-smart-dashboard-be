const httpStatus = require('http-status');
const axios = require('axios');
const { Doctor, DoctorProfile } = require('../models');
const ApiError = require('../utils/ApiError');
const { api } = require('../config/config');

/**
 * Query for doctors
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryDoctors = async (filter, options) => {
  const pipeline = [
    {
      $lookup: {
        from: 'doctorprofiles',
        localField: 'id',
        foreignField: 'idDoctor',
        as: 'profile',
      },
    },
    {
      $unwind: '$profile',
    },
    {
      $project: {
        _id: 0,
        id: '$id',
        name: '$name',
        verificationStatus: '$profile.verificationStatus',
        // detailDoctorURL: {
        //   $concat: ['http://localhost:3000/v1/doctors/', { $toString: '$id' }],
        // },
      },
    },
  ];
  const doctors = await Doctor.paginate(pipeline, filter, options);
  const verificationStatusCount = await DoctorProfile.aggregate([
    { $match: { verificationStatus: { $in: ['verified', 'unverified'] } } },
    { $group: { _id: '$verificationStatus', count: { $sum: 1 } } },
    {
      $project: {
        verificationStatus: '$_id',
        count: 1,
        _id: 0,
      },
    },
  ]);
  doctors.verificationStatusCount = verificationStatusCount;
  return doctors;
};

/**
 * Get doctor by id
 * @param {idDoctor} id
 * @returns {Promise<Doctor>}
 */
const getDoctorById = async (id) => {
  const doctorId = parseInt(id, 10);
  const doctor = Doctor.aggregate([
    {
      $match: {
        id: doctorId,
      },
    },
    {
      $lookup: {
        from: 'clinichistories',
        localField: 'id',
        foreignField: 'serviceDetails.idDoctor',
        as: 'clinichistories',
      },
    },
    {
      $lookup: {
        from: 'consultationhistories',
        localField: 'id',
        foreignField: 'serviceDetails.id',
        as: 'consultationhistories',
      },
    },
    {
      $lookup: {
        from: 'doctorprofiles',
        localField: 'id',
        foreignField: 'idDoctor',
        as: 'profile',
      },
    },
    {
      $lookup: {
        from: 'doctorfeedbacks',
        localField: 'id',
        foreignField: 'id',
        as: 'feedbacks',
      },
    },
    {
      $unwind: '$profile',
    },
    {
      $unwind: '$feedbacks',
    },
    {
      $project: {
        _id: 0,
        id: 1,
        name: 1,
        specialization: 1,
        workPlace: 1,
        consultationPrice: 1,
        feedback: '$feedbacks.feedBackDoctor',
        cardUrl: '$profile.cardUrl',
        verificationStatus: '$profile.verificationStatus',
        DoctorWorkSchedule: 1,
        DoctorExperience: 1,
        clinicPatientsCount: { $size: '$clinichistories' },
        consultationPatientsCount: { $size: '$consultationhistories' },
        totalAmountFromClinic: {
          $sum: {
            $map: {
              input: '$clinichistories',
              in: { $toDouble: { $arrayElemAt: ['$$this.midtransResponse.payment_amounts.amount', 0] } },
            },
          },
        },
        totalAmountFromConsultation: {
          $sum: {
            $map: {
              input: '$consultationhistories',
              in: { $toDouble: { $arrayElemAt: ['$$this.midtransResponse.payment_amounts.amount', 0] } },
            },
          },
        },
      },
    },
  ]);
  if (!doctor || doctor.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Doctor not found');
  }
  return doctor;
};

/**
 * Verify doctor
 * @param {idDoctor} id
 * @param {string} verificationStatus
 * @returns {Promise<Doctor>}
 */
const verifyDoctor = async (id, verificationStatus) => {
  const doctor = await DoctorProfile.findOne({ idDoctor: id });
  if (!doctor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Doctor not found');
  }
  doctor.verificationStatus = verificationStatus;
  const idDoctor = parseInt(id, 10);
  await doctor.save();
  try {
    await axios.put(`${api.verifyDoctor}/${idDoctor}`, { verificationStatus }, { headers: { 'x-api-key': api.key } });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error when verify doctor');
  }
  return doctor;
};

/**
 * OCR doctor card
 * @param {idDoctor} id
 * @param {string} cardUrl
 * @returns {Promise<Doctor>}
 */
const ocrDoctorCard = async (idDoctor) => {
  const id = parseInt(idDoctor, 10);
  const doctor = await DoctorProfile.findOne({ idDoctor: id });
  if (!doctor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Doctor not found');
  }
  try {
    const data = JSON.stringify({ image_url: doctor.cardUrl });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: api.ocrDoctorCard,
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    };

    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.response, 'Error when OCR doctor card');
  }
};

module.exports = {
  queryDoctors,
  getDoctorById,
  verifyDoctor,
  ocrDoctorCard,
};
