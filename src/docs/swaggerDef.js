const { version } = require('../../package.json');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'node-express-boilerplate API documentation',
    version,
    license: {
      name: 'MIT',
      url: 'https://github.com/hagopj13/node-express-boilerplate/blob/master/LICENSE',
    },
  },
  servers: [
    {
      url: `https://devcapstonepwa-qlarjzkb3q-uc.a.run.app/v1`,
    },
  ],
};

module.exports = swaggerDef;
