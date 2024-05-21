const Joi = require('joi');

const getClinicFeedbacks = {
  query: Joi.object().keys({
    id: Joi.string(),
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getDoctorFeedbacks = {
  query: Joi.object().keys({
    id: Joi.string(),
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getClinicFeedback = {
  params: Joi.object().keys({
    clinicId: Joi.string().required(),
  }),
};

const getDoctorFeedback = {
  params: Joi.object().keys({
    doctorId: Joi.string().required(),
  }),
};

module.exports = {
  getClinicFeedbacks,
  getDoctorFeedbacks,
  getClinicFeedback,
  getDoctorFeedback,
};
