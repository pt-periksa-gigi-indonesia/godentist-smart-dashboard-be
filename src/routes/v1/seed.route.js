const express = require('express');
const seed = require('../../controllers/seed.controller');

const router = express.Router();

router.route('/').get(seed.seed);

module.exports = router;
