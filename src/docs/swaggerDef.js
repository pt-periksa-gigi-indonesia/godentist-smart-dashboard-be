const { version } = require('../../package.json');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'Godentist PWA system REST API documentation',
    version,
    license: {
      name: 'MIT',
      url: 'https://github.com/pt-periksa-gigi-indonesia/godentist-smart-dashboard-be',
    },
  },
  servers: [
    {
      url: `https://devcapstonepwa-qlarjzkb3q-uc.a.run.app/v1`,
    },
  ],
};

module.exports = swaggerDef;
