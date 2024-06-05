const { ClinicHistory, ConsultationHistory, DoctorProfile, ClinicFeedback } = require('../models');

/**
 * Get dashboard data
 * @returns {Promise<Dashboard>}
 */
const getDashboardData = async () => {
  let result = {};
  const doctorCount = await DoctorProfile.aggregate([
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
  const clinicCount = await ClinicFeedback.countDocuments();
  const consultationPatientsCount = await ConsultationHistory.countDocuments();
  const clinicPatientsCount = await ClinicHistory.countDocuments();
  const totalAmountFromClinic = await ClinicHistory.aggregate([
    {
      $project: {
        totalAmount: {
          $cond: {
            if: {
              $gt: [{ $size: { $ifNull: ['$midtransResponse.payment_amounts', []] } }, 0],
            },
            then: { $arrayElemAt: ['$midtransResponse.payment_amounts.amount', 0] },
            else: '$serviceDetails.amount',
          },
        },
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: {
          $sum: { $toDouble: '$totalAmount' },
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalAmount: 1,
      },
    },
  ]);
  const totalAmountFromConsultation = await ConsultationHistory.aggregate([
    {
      $project: {
        totalAmount: {
          $arrayElemAt: ['$midtransResponse.payment_amounts.amount', 0],
        },
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: {
          $sum: {
            $toDouble: '$totalAmount',
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalAmount: 1,
      },
    },
  ]);
  const latestFeedbacks = await ClinicFeedback.aggregate([
    {
      $unwind: '$FeedBackClinic',
    },
    {
      $project: {
        _id: 0,
        name: '$name',
        feedback: '$FeedBackClinic.message',
        createdAt: '$FeedBackClinic.createdAt',
      },
    },
    {
      $unionWith: {
        coll: 'doctorfeedbacks',
        pipeline: [
          {
            $unwind: '$feedBackDoctor',
          },
          {
            $project: {
              _id: 0,
              name: '$name',
              feedback: '$feedBackDoctor.message',
              createdAt: '$feedBackDoctor.createdAt',
            },
          },
        ],
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $limit: 10,
    },
  ]);
  const popularServices = await ClinicHistory.aggregate([
    {
      $unwind: '$serviceDetails.servicesName',
    },
    {
      $group: {
        _id: '$serviceDetails.servicesName',
        timesBooked: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        serviceName: '$_id',
        timesBooked: 1,
      },
    },
    {
      $sort: { timesBooked: -1 },
    },
    {
      $limit: 10,
    },
  ]);
  const totalTransactionsEachMonth = await ConsultationHistory.aggregate([
    {
      $unionWith: {
        coll: 'clinichistories',
      },
    },
    {
      $addFields: {
        amount: {
          $cond: {
            if: {
              $gt: [{ $size: { $ifNull: ['$midtransResponse.payment_amounts', []] } }, 0],
            },
            then: { $toDouble: { $arrayElemAt: ['$midtransResponse.payment_amounts.amount', 0] } },
            else: { $toDouble: '$serviceDetails.amount' },
          },
        },
      },
    },
    {
      $project: {
        createdAt: 1,
        amount: 1,
      },
    },
    {
      $project: {
        month: {
          $month: '$createdAt',
        },
        amount: 1,
      },
    },
    {
      $group: {
        _id: '$month',
        totalRevenue: {
          $sum: '$amount',
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
    {
      $project: {
        _id: 0,
        month: {
          $arrayElemAt: [
            [
              '',
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December',
            ],
            '$_id',
          ],
        },
        totalRevenue: 1,
      },
    },
  ]);
  const notification = await DoctorProfile.aggregate([
    {
      $match: {
        verificationStatus: { $ne: 'verified' },
      },
    },
    {
      $project: {
        _id: 0,
        doctorName: '$doctorName',
      },
    },
  ]);
  result = {
    doctorCount,
    clinicCount,
    consultationPatientsCount,
    clinicPatientsCount,
    totalAmountFromClinic: totalAmountFromClinic[0].totalAmount,
    totalAmountFromConsultation: totalAmountFromConsultation[0].totalAmount,
    latestFeedbacks,
    popularServices,
    totalTransactionsEachMonth,
    notification,
  };
  return result;
};

module.exports = {
  getDashboardData,
};
