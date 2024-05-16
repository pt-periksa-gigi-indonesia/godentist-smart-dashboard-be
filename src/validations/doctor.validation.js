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

const verifyDoctor = {
  params: Joi.object().keys({
    doctorId: Joi.string().required(),
  }),
  body: Joi.object().keys({
    verificationStatus: Joi.string().required(),
  }),
};

module.exports = {
  getDoctors,
  verifyDoctor,
};
