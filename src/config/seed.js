const { fetchDataFromEndpoints } = require('../services/api.service');
const {
  Doctor,
  DoctorFeedback,
  DoctorProfile,
  ClinicHistory,
  ConsultationHistory,
  ClinicFeedback,
  seedLog,
} = require('../models');
const logger = require('./logger');

async function seedDatabase() {
  try {
    // Start fetching data and dropping collections in parallel
    const dataPromise = fetchDataFromEndpoints();
    const collections = [Doctor, DoctorFeedback, DoctorProfile, ClinicHistory, ConsultationHistory, ClinicFeedback];

    const dropCollections = collections.map((collection) =>
      collection.collection.drop().catch((error) => {
        if (error.code === 26) {
          logger.info(`Collection ${collection.collection.name} does not exist`);
        } else {
          logger.error('Drop collection error:', error);
        }
      })
    );

    await Promise.all(dropCollections);

    // Wait for data fetching to complete
    const data = await dataPromise;

    // Insert data in parallel
    const insertPromises = [
      Doctor.insertMany(data.doctors),
      DoctorFeedback.insertMany(data.doctorFeedbacks),
      DoctorProfile.insertMany(data.doctorProfiles),
      ClinicHistory.insertMany(data.clinicHistories),
      ConsultationHistory.insertMany(data.consultationHistories),
      ClinicFeedback.insertMany(data.clinicFeedbacks),
    ];
    await Promise.all(insertPromises);

    // Log the seed status
    await seedLog.create({ status_code: 201, message: 'Database seeded successfully' });
    logger.info('Database seeded successfully');
  } catch (error) {
    await seedLog.create({ status_code: 500, message: error.message || 'Unknown error' });
    logger.error('Error seeding the database:', error);
  }
}

module.exports = seedDatabase;
