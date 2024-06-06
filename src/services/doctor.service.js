const httpStatus = require('http-status');
const axios = require('axios');
const crypto = require('crypto');
const { Doctor, DoctorProfile, OcrResult } = require('../models');
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
      $unwind: '$profile',
    },
    {
      $project: {
        _id: 0,
        id: 1,
        name: 1,
        specialization: 1,
        workPlace: 1,
        consultationPrice: 1,
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
              in: {
                $cond: {
                  if: { $gt: [{ $size: { $ifNull: ['$$this.midtransResponse.payment_amounts', []] } }, 0] },
                  then: { $toDouble: { $arrayElemAt: ['$$this.midtransResponse.payment_amounts.amount', 0] } },
                  else: '$$this.serviceDetails.amount',
                },
              },
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
    const dataResponse = {
      nama: response.data.NAMA,
      nik: response.data.NIK,
      tempatTanggalLahir: response.data['Tempat Tanggal Lahir'],
      alamat: response.data.ALAMAT,
      jenisKelamin: response.data['JENIS KELAMIN'],
    };
    return dataResponse;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.response, 'Error when OCR doctor card');
  }
};

const algorithm = 'aes-256-cbc';

const createKey = (name) => {
  return crypto.createHash('sha256').update(name).digest();
};

const encrypt = (text, key) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
};

const decrypt = (encrypted, key) => {
  const parts = encrypted.split(':');
  const iv = Buffer.from(parts.shift(), 'hex');
  const encryptedText = parts.join(':');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

/**
 * OCR doctor card with database integration
 * @param {idDoctor} id
 * @param {string} cardUrl
 * @returns {Promise<Doctor>}
 */
const ocrDoctorCardDB = async (idDoctor) => {
  const id = parseInt(idDoctor, 10);
  const doctor = await DoctorProfile.findOne({ idDoctor: id });
  if (!doctor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Doctor not found');
  }

  const key = createKey(doctor.doctorName);

  let ocr = await OcrResult.findOne({ idDoctor: id });
  if (ocr) {
    return JSON.parse(decrypt(ocr.encryptedData, key));
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
    const ocrData = response.data;

    const dataToEncrypt = JSON.stringify({
      nama: ocrData.NAMA,
      nik: ocrData.NIK,
      tempatTanggalLahir: ocrData['Tempat Tanggal Lahir'],
      alamat: ocrData.ALAMAT,
      jenisKelamin: ocrData['JENIS KELAMIN'],
    });

    const encryptedData = encrypt(dataToEncrypt, key);

    ocr = new OcrResult({
      idDoctor: id,
      encryptedData,
    });
    await ocr.save();

    return JSON.parse(decrypt(encryptedData, key));
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error when OCR doctor card', error.response);
  }
};

/**
 * OCR doctor card with database integration
 * @param {idDoctor} id
 * @param {string} newData
 * @returns {Promise<Doctor>}
 */
const editOcrDoctorCard = async (idDoctor, newData) => {
  const id = parseInt(idDoctor, 10);
  const doctor = await DoctorProfile.findOne({ idDoctor: id });
  if (!doctor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Doctor not found');
  }
  try {
    const key = createKey(doctor.doctorName);

    const ocr = await OcrResult.findOne({ idDoctor });
    if (!ocr) {
      throw new Error('OCR data not found for the provided doctor ID.');
    }

    const decryptedData = decrypt(ocr.encryptedData, key);

    const parsedData = JSON.parse(decryptedData);

    Object.assign(parsedData, newData);

    const reEncryptedData = encrypt(JSON.stringify(parsedData), key);

    ocr.encryptedData = reEncryptedData;
    await ocr.save();

    return parsedData;
  } catch (error) {
    throw new Error(`Error editing encrypted OCR data: ${error.message}`);
  }
};

module.exports = {
  queryDoctors,
  getDoctorById,
  verifyDoctor,
  ocrDoctorCard,
  ocrDoctorCardDB,
  editOcrDoctorCard,
};
