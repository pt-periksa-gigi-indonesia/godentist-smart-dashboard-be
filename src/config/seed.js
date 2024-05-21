const { fetchDataFromEndpoints } = require('../services/api.service');
const { Doctor, DoctorFeedback, DoctorProfile, ClinicHistory, ConsultationHistory, ClinicFeedback } = require('../models');
const logger = require('./logger');

async function seedDatabase() {
  try {
    const data = await fetchDataFromEndpoints();

    // Drop collections if they exist
    const collections = [Doctor, DoctorFeedback, DoctorProfile, ClinicHistory, ConsultationHistory, ClinicFeedback];
    await Promise.all(
      collections.map((collection) =>
        collection.collection.drop().catch((error) => logger.error('Drop collection error:', error))
      )
    );

    // Insert data
    const insertPromises = [
      Doctor.insertMany(data.doctors),
      DoctorFeedback.insertMany(data.doctorFeedbacks),
      DoctorProfile.insertMany(data.doctorProfiles),
      ClinicHistory.insertMany(data.clinicHistories),
      ConsultationHistory.insertMany(data.consultationHistories),
      ClinicFeedback.insertMany(data.clinicFeedbacks),
    ];
    await Promise.all(insertPromises);

    logger.info('Database seeded successfully');
  } catch (error) {
    logger.error('Error seeding the database:', error);
  }
}

module.exports = seedDatabase;
