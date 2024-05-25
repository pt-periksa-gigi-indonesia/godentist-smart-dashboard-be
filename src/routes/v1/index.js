const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const seedRoute = require('./seed.route');
const doctorRoute = require('./doctor.route');
const clinicRoute = require('./clinic.route');
const feedbackRoute = require('./feedback.route');
const dashboardRoute = require('./dashboard.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/seed',
    route: seedRoute,
  },
  {
    path: '/doctors',
    route: doctorRoute,
  },
  {
    path: '/clinics',
    route: clinicRoute,
  },
  {
    path: '/feedbacks',
    route: feedbackRoute,
  },
  {
    path: '/dashboard',
    route: dashboardRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
