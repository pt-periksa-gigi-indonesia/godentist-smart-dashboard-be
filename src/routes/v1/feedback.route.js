const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const feedbackController = require('../../controllers/feedback.controller');
const feedbackValidation = require('../../validations/feedback.validation');

const router = express.Router();

router.get('/clinic', auth('admin'), validate(feedbackValidation.getClinicFeedbacks), feedbackController.getClinicFeedbacks);

router.get('/doctor', auth('admin'), validate(feedbackValidation.getDoctorFeedbacks), feedbackController.getDoctorFeedbacks);

router.get(
  '/clinic/:clinicId',
  auth('admin'),
  validate(feedbackValidation.getClinicFeedback),
  feedbackController.getClinicFeedback
);

router.get(
  '/doctor/:doctorId',
  auth('admin'),
  validate(feedbackValidation.getDoctorFeedback),
  feedbackController.getDoctorFeedback
);

module.exports = router;
