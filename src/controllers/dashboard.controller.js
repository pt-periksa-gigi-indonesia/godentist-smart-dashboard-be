const { dashboardService } = require('../services');
const catchAsync = require('../utils/catchAsync');

const getDashboardData = catchAsync(async (req, res) => {
  const result = await dashboardService.getDashboardData();
  res.send(result);
});

module.exports = {
  getDashboardData,
};
