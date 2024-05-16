const { Doctor } = require('../models');

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
        detailDoctorURL: {
          $concat: ['http://localhost:3000/v1/doctors/', { $toString: '$id' }],
        },
      },
    },
  ];
  const doctors = await Doctor.paginate(pipeline, filter, options);
  return doctors;
};

/**
 * Get doctor by id
 * @param {ObjectId} id
 * @returns {Promise<Doctor>}
 */
const getDoctorById = async (id) => {
  const doctorId = parseInt(id, 10);
  return Doctor.aggregate([
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
};

module.exports = {
  queryDoctors,
  getDoctorById,
};
