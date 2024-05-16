const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const doctorController = require('../../controllers/doctor.controller');
const doctorValidation = require('../../validations/doctor.validation');

const router = express.Router();

router.get('/', auth('admin'), validate(doctorValidation.getDoctors), doctorController.getDoctors);

router.get('/:doctorId', auth('admin'), doctorController.getDoctorById);

router.patch('/verify/:doctorId', auth('admin'), validate(doctorValidation.verifyDoctor), doctorController.verifyDoctor);

module.exports = router;
