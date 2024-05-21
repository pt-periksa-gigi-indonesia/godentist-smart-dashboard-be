const axios = require('axios');
const { api } = require('../config/config');
const logger = require('../config/logger');

const endpoints = [api.doctor, api.feedback, api.profile, api.clinic, api.consultation, api.clinicFeedback];

const axiosInstance = axios.create({
  headers: {
    'x-api-key': api.key,
  },
});

// Function to fetch data from all endpoints concurrently
async function fetchDataFromEndpoints() {
  try {
    // Fetch data concurrently from all endpoints
    const results = await Promise.all(endpoints.map((endpoint) => axiosInstance.get(endpoint)));

    // Extract data from the axios responses
    const [doctors, doctorFeedbacks, doctorProfiles, clinicHistories, consultationHistories, clinicFeedbacks] = results.map(
      (response) => response.data.data
    );

    const allData = {
      doctors,
      doctorFeedbacks,
      doctorProfiles,
      clinicHistories,
      consultationHistories,
      clinicFeedbacks,
    };
    return allData;
  } catch (error) {
    logger.error(error);
  }
}
module.exports = {
  fetchDataFromEndpoints,
};
