const express = require('express');
const auth = require('../../middlewares/auth');
const seed = require('../../controllers/seed.controller');

const router = express.Router();

router.route('/').get(auth('manageUsers'), seed.seed);

module.exports = router;
