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

/**
 * @swagger
 * tags:
 *   name: Feedback
 *   description: Feedback retrieval
 */

/**
 * @swagger
 * /feedbacks/clinic:
 *   get:
 *     summary: Get all feedbacks clinic
 *     description: Only admins can retrieve all feedbacks clinic.
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: Filter feedbacks by clinic id.
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter feedbacks by clinic name.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort feedbacks by a specific field in the form of field:desc/asc (ex. name:asc).
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of feedbacks to retrieve.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 1
 *         description: Page number.
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 2
 *                       name:
 *                         type: string
 *                         example: "Satu Dental"
 *                       feedback:
 *                         type: string
 *                         example: "Ini feedback ke 2"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-05-14T13:23:24.055Z"
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *                 totalClinicFeedbacks:
 *                   type: integer
 *                   example: 6
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /feedbacks/doctor:
 *   get:
 *     summary: Get all feedbacks doctor
 *     description: Only admins can retrieve all feedbacks doctor.
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: Filter feedbacks by doctor id.
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter feedbacks by doctor name.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort feedbacks by a specific field in the form of field:desc/asc (ex. name:asc).
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of feedbacks to retrieve.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 1
 *         description: Page number.
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "drg. John"
 *                       feedback:
 *                         type: string
 *                         example: "ini feedback pertama dr john doe"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-05-14T13:30:12.636Z"
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *                 totalDoctorFeedbacks:
 *                   type: integer
 *                   example: 7
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /feedbacks/clinic/{clinicId}:
 *   get:
 *     summary: Get a feedbacks clinic by id
 *     description: Only admins can retrieve a feedbacks clinic.
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clinicId
 *         required: true
 *         schema:
 *           type: string
 *         description: The clinic ID.
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: 2
 *                   name:
 *                     type: string
 *                     example: "Satu Dental"
 *                   feedback:
 *                     type: string
 *                     example: "Ini feedback ke 2"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-05-14T13:23:24.055Z"
 *
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /feedbacks/doctor/{doctorId}:
 *   get:
 *     summary: Get a feedbacks doctor by id
 *     description: Only admins can retrieve a feedbacks doctor.
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *         description: The doctor ID.
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "drg. John"
 *                   feedback:
 *                     type: string
 *                     example: "ini feedback pertama dr john doe"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-05-14T13:30:12.636Z"
 *
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
