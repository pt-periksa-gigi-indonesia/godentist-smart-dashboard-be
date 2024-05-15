const { ClinicHistory } = require('../models');
const { ConsultationHistory } = require('../models');

const getAllClinicHistories = async () => {
  return ClinicHistory.find();
};

const getClinicHistoryById = async (id) => {
  return ClinicHistory.findById(id);
};

const getAllConsultationHistories = async () => {
  return ConsultationHistory.find();
};

const getConsultationHistoryById = async (id) => {
  return ConsultationHistory.findById(id);
};

module.exports = {
  getAllClinicHistories,
  getClinicHistoryById,
  getAllConsultationHistories,
  getConsultationHistoryById,
};
