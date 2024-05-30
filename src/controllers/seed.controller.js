const catchAsync = require('../utils/catchAsync');
const seedDatabase = require('../config/seed');
const { seedLog } = require('../models');

const seed = catchAsync(async (req, res) => {
  await seedDatabase();
  const latestSeedLog = await seedLog.findOne().sort({ _id: -1 });
  res
    .status(latestSeedLog.status_code)
    .send({ status_code: latestSeedLog.status_code, message: latestSeedLog.message, createdAt: latestSeedLog.createdAt });
});

const latestSeedDate = catchAsync(async (req, res) => {
  const latestSeedLog = await seedLog.findOne().sort({ _id: -1 });
  res.send({ createdAt: latestSeedLog.createdAt });
});

module.exports = {
  seed,
  latestSeedDate,
};
