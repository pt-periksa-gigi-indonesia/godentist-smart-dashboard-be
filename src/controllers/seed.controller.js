const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const seedDatabase = require('../config/seed');

const seed = catchAsync(async (req, res) => {
  await seedDatabase();
  res.status(httpStatus.CREATED).send({ message: 'Database successfully seeded' });
});

module.exports = {
  seed,
};
