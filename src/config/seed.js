const { fetchDataFromEndpoints } = require('../services/api.service');
const { Doctor, Feedback, Profile, ClinicHistory, ConsultationHistory } = require('../models');
const logger = require('./logger');

async function seedDatabase() {
  try {
    const data = await fetchDataFromEndpoints();

    // Prepare promises for clearing existing collections
    const deleteOperations = [
      Doctor.deleteMany({}),
      Feedback.deleteMany({}),
      Profile.deleteMany({}),
      ClinicHistory.deleteMany({}),
      ConsultationHistory.deleteMany({}),
    ];

    // Wait for all delete operations to complete
    await Promise.all(deleteOperations);

    // Prepare promises for inserting documents into collections
    const insertOperations = [
      Doctor.insertMany(data.doctors),
      Feedback.insertMany(data.feedbacks),
      Profile.insertMany(data.profiles),
      ClinicHistory.insertMany(data.clinicHistories),
      ConsultationHistory.insertMany(data.consultationHistories),
    ];

    // Wait for all insert operations to complete
    await Promise.all(insertOperations);

    logger.info('Database seeded');
  } catch (error) {
    logger.error(error);
  }
}

module.exports = seedDatabase;
