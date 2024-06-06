const Joi = require('joi');

const getDoctors = {
  query: Joi.object().keys({
    id: Joi.string(),
    name: Joi.string(),
    verificationStatus: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getDoctor = {
  params: Joi.object().keys({
    doctorId: Joi.string().required(),
  }),
};

const verifyDoctor = {
  params: Joi.object().keys({
    doctorId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    verificationStatus: Joi.string().required(),
  }),
};

const ocrDoctorCard = {
  body: Joi.object().keys({
    doctorId: Joi.number().required(),
  }),
};

const ocrDoctorCardDB = {
  body: Joi.object().keys({
    doctorId: Joi.number().required(),
  }),
};

const editOcrDoctorCard = {
  body: Joi.object().keys({
    doctorId: Joi.number().required(),
    nama: Joi.string(),
    nik: Joi.string(),
    tempatTanggalLahir: Joi.string(),
    alamat: Joi.string(),
    jenisKelamin: Joi.string(),
  }),
};

module.exports = {
  getDoctors,
  getDoctor,
  verifyDoctor,
  ocrDoctorCard,
  ocrDoctorCardDB,
  editOcrDoctorCard,
};
