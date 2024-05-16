const { fetchDataFromEndpoints } = require('../services/api.service');
const { Doctor, DoctorFeedback, DoctorProfile, ClinicHistory, ConsultationHistory, ClinicFeedback } = require('../models');
const logger = require('./logger');

async function seedDatabase() {
  try {
    const data = await fetchDataFromEndpoints();

    // Prepare promises for clearing existing collections
    const deleteOperations = [
      Doctor.deleteMany({}),
      DoctorFeedback.deleteMany({}),
      DoctorProfile.deleteMany({}),
      ClinicHistory.deleteMany({}),
      ConsultationHistory.deleteMany({}),
      ClinicFeedback.deleteMany({}),
    ];

    // Wait for all delete operations to complete
    await Promise.all(deleteOperations);

    // Prepare promises for inserting documents into collections
    const insertOperations = [
      Doctor.insertMany(data.doctors),
      DoctorFeedback.insertMany(data.doctorFeedbacks),
      DoctorProfile.insertMany(data.doctorProfiles),
      ClinicHistory.insertMany(data.clinicHistories),
      ConsultationHistory.insertMany(data.consultationHistories),
      ClinicFeedback.insertMany(data.clinicFeedbacks),
    ];

    // Wait for all insert operations to complete
    await Promise.all(insertOperations);

    logger.info('Database seeded');
  } catch (error) {
    logger.error(error);
  }
}

module.exports = seedDatabase;
