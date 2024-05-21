const Joi = require('joi');

const getClinics = {
  query: Joi.object().keys({
    id: Joi.string(),
    name: Joi.string(),
    verificationStatus: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getClinic = {
  params: Joi.object().keys({
    clinicId: Joi.string().required(),
  }),
};

module.exports = {
  getClinics,
  getClinic,
};
