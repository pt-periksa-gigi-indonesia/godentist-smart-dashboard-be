const express = require('express');
const auth = require('../../middlewares/auth');
const doctorController = require('../../controllers/doctor.controller');

const router = express.Router();

router.get('/', auth('admin'), doctorController.queryDoctors);

router.get('/:doctorId', auth('admin'), doctorController.getDoctorById);

router.patch('/verify/:doctorId', doctorController.verifyDoctor);

module.exports = router;
