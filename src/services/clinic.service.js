const { ClinicHistory, ClinicFeedback } = require('../models');
/**
 * Query for clinic histories
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryClinicHistories = async (filter, options) => {
  const pipeline = [
    {
      $lookup: {
        from: 'clinichistories',
        localField: 'id',
        foreignField: 'serviceDetails.idClinic',
        as: 'transactions',
      },
    },
    {
      $unwind: {
        path: '$transactions',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: '$transactions.midtransResponse.payment_amounts',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: {
          id: '$id',
          name: '$name',
        },
        totalAmountTransactions: {
          $sum: { $toDouble: '$transactions.midtransResponse.payment_amounts.amount' },
        },
        totalTransactions: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: 0,
        id: '$_id.id',
        name: '$_id.name',
        totalAmountTransactions: 1,
        totalTransactions: 1,
      },
    },
  ];
  const clinicHistories = await ClinicFeedback.paginate(pipeline, filter, options);
  const totalTransactions = await ClinicHistory.countDocuments();
  const totalAmountTransactions = await ClinicHistory.aggregate([
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
  let result = {};
  result = {
    ...clinicHistories,
    totalTransactions,
    totalAmountTransactions: totalAmountTransactions[0].totalAmount,
  };
  return result;
};

/**
 * Get clinic by id
 * @param {idClinic} id
 * @returns {Promise<Clinic>}
 */
const getClinicById = async (id) => {
  const idClinic = parseInt(id, 10);
  const pipeline = [
    {
      $match: {
        'serviceDetails.idClinic': idClinic,
      },
    },
    {
      $group: {
        _id: {
          idClinic: '$serviceDetails.idClinic',
          idDoctor: '$serviceDetails.idDoctor',
          doctorName: '$serviceDetails.doctorName',
          doctorSpecialization: '$serviceDetails.doctorSpecialization',
          serviceName: '$serviceDetails.servicesName',
          servicePrice: '$serviceDetails.servicesPrice',
        },
        clinicName: {
          $first: '$serviceDetails.clinicName',
        },
        totalPatients: { $sum: 1 },
        totalAmount: {
          $sum: {
            $toDouble: {
              $arrayElemAt: ['$midtransResponse.payment_amounts.amount', 0],
            },
          },
        },
      },
    },
    {
      $group: {
        _id: '$_id.idClinic',
        clinicName: { $first: '$clinicName' },
        totalPatientClinic: {
          $sum: '$totalPatients',
        },
        totalAmountClinic: { $sum: '$totalAmount' },
        clinicDoctorStats: {
          $push: {
            idDoctor: '$_id.idDoctor',
            doctorName: '$_id.doctorName',
            doctorSpecialization: '$_id.doctorSpecialization',
            totalPatientDoctor: '$totalPatients',
          },
        },
        clinicServiceStats: {
          $push: {
            serviceName: {
              $arrayElemAt: ['$_id.serviceName', 0],
            },
            servicePrice: {
              $arrayElemAt: ['$_id.servicePrice', 0],
            },
            totalPatientService: '$totalPatients',
          },
        },
      },
    },
    {
      $lookup: {
        from: 'clinicfeedbacks',
        localField: '_id',
        foreignField: 'id',
        as: 'clinicFeedback',
      },
    },
    {
      $project: {
        _id: 0,
        idClinic: '$_id',
        clinicName: 1,
        totalPatientClinic: 1,
        totalAmountClinic: 1,
        clinicDoctorStats: 1,
        clinicServiceStats: 1,
        clinicFeedback: '$clinicFeedback.FeedBackClinic',
      },
    },
    {
      $set: {
        clinicDoctorStats: {
          $map: {
            input: {
              $reduce: {
                input: '$clinicDoctorStats',
                initialValue: [],
                in: {
                  $let: {
                    vars: {
                      existing: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$$value',
                              as: 'doc',
                              cond: {
                                $eq: ['$$doc.idDoctor', '$$this.idDoctor'],
                              },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: {
                      $cond: [
                        {
                          $gt: ['$$existing', null],
                        },
                        {
                          $concatArrays: [
                            {
                              $filter: {
                                input: '$$value',
                                as: 'doc',
                                cond: {
                                  $ne: ['$$doc.idDoctor', '$$this.idDoctor'],
                                },
                              },
                            },
                            [
                              {
                                idDoctor: '$$existing.idDoctor',
                                doctorName: '$$existing.doctorName',
                                doctorSpecialization: '$$existing.doctorSpecialization',
                                totalPatientDoctor: {
                                  $sum: ['$$existing.totalPatientDoctor', '$$this.totalPatientDoctor'],
                                },
                              },
                            ],
                          ],
                        },
                        {
                          $concatArrays: ['$$value', ['$$this']],
                        },
                      ],
                    },
                  },
                },
              },
            },
            as: 'item',
            in: '$$item',
          },
        },
        clinicServiceStats: {
          $map: {
            input: {
              $reduce: {
                input: '$clinicServiceStats',
                initialValue: [],
                in: {
                  $let: {
                    vars: {
                      existing: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$$value',
                              as: 'service',
                              cond: {
                                $eq: ['$$service.serviceName', '$$this.serviceName'],
                              },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: {
                      $cond: [
                        {
                          $gt: ['$$existing', null],
                        },
                        {
                          $concatArrays: [
                            {
                              $filter: {
                                input: '$$value',
                                as: 'service',
                                cond: {
                                  $ne: ['$$service.serviceName', '$$this.serviceName'],
                                },
                              },
                            },
                            [
                              {
                                serviceName: '$$existing.serviceName',
                                servicePrice: '$$existing.servicePrice',
                                totalPatientService: {
                                  $sum: ['$$existing.totalPatientService', '$$this.totalPatientService'],
                                },
                              },
                            ],
                          ],
                        },
                        {
                          $concatArrays: ['$$value', ['$$this']],
                        },
                      ],
                    },
                  },
                },
              },
            },
            as: 'item',
            in: '$$item',
          },
        },
      },
    },
    {
      $set: {
        clinicDoctorStats: {
          $sortArray: {
            input: '$clinicDoctorStats',
            sortBy: { totalPatientDoctor: -1 },
          },
        },
        clinicServiceStats: {
          $sortArray: {
            input: '$clinicServiceStats',
            sortBy: { totalPatientService: -1 },
          },
        },
      },
    },
  ];
  const clinicHistories = await ClinicHistory.aggregate(pipeline);
  return clinicHistories;
};

module.exports = {
  queryClinicHistories,
  getClinicById,
};
