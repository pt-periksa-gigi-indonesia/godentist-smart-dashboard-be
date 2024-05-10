const { Doctor } = require('../models');
const { Feedback } = require('../models');
const { Profile } = require('../models');
// const ApiError = require('../utils/ApiError');

const getAllDoctors = async () => {
  return Doctor.find();
};

const getDoctorById = async (id) => {
  return Doctor.findById(id);
};

const getAllFeedbacks = async () => {
  return Feedback.find();
};

const getFeedbacksByDoctorId = async (id) => {
  return Feedback.find({ doctorId: id });
};

const getAllProfiles = async () => {
  return Profile.find();
};

const getProfileByDoctorId = async (id) => {
  return Profile.findOne({ doctorId: id });
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  getAllFeedbacks,
  getFeedbacksByDoctorId,
  getAllProfiles,
  getProfileByDoctorId,
};
