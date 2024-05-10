const { fetchDataFromEndpoints } = require('../services/api.service');
const { Doctor, Feedback, Profile, ClinicHistory, ConsultationHistory } = require('../models');
const logger = require('./logger');

async function seedDatabase() {
  try {
    const data = await fetchDataFromEndpoints();

    // Clear existing collections
    await Doctor.deleteMany({});
    await Feedback.deleteMany({});
    await Profile.deleteMany({});
    await ClinicHistory.deleteMany({});
    await ConsultationHistory.deleteMany({});

    // Insert documents into collections
    await Doctor.insertMany(data.doctors);
    await Feedback.insertMany(data.feedbacks);
    await Profile.insertMany(data.profiles);
    await ClinicHistory.insertMany(data.clinicHistories);
    await ConsultationHistory.insertMany(data.consultationHistories);

    logger.info('Database seeded');
  } catch (error) {
    logger.error(error);
  }
}

module.exports = seedDatabase;
