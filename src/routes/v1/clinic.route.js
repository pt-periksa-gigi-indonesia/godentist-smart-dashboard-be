const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const clinicController = require('../../controllers/clinic.controller');
const clinicValidation = require('../../validations/clinic.validation');

const router = express.Router();

router.get('/', auth('admin'), validate(clinicValidation.getClinics), clinicController.getClinics);

router.get('/:clinicId', auth('admin'), validate(clinicValidation.getClinic), clinicController.getClinic);

module.exports = router;
