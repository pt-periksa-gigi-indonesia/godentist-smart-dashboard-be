const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const clinicController = require('../../controllers/clinic.controller');
const clinicValidation = require('../../validations/clinic.validation');

const router = express.Router();

router.get('/', auth('admin'), validate(clinicValidation.getClinics), clinicController.getClinics);

router.get('/:clinicId', auth('admin'), validate(clinicValidation.getClinic), clinicController.getClinic);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Clinic
 *   description: Clinic retrieval
 */

/**
 * @swagger
 * /clinics:
 *   get:
 *     summary: Get all clinics
 *     description: Only admins can retrieve all clinics.
 *     tags: [Clinic]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: Filter clinics by id.
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter clinics by name.
 *       - in: query
 *         name: verificationStatus
 *         schema:
 *           type: string
 *         description: Filter clinics by verification status.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort clinics by a specific field in the form of field:desc/asc (ex. name:asc).
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of clinics to retrieve.
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
 *                       totalAmountTransactions:
 *                         type: integer
 *                         example: 4300000
 *                       totalTransactions:
 *                         type: integer
 *                         example: 9
 *                       id:
 *                         type: string
 *                         example: "2"
 *                       name:
 *                         type: string
 *                         example: "Satu Dental"
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
 *                 totalTransactions:
 *                   type: integer
 *                   example: 9
 *                 totalAmountTransactions:
 *                   type: integer
 *                   example: 4300000
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /clinics/{clinicId}:
 *   get:
 *     summary: Get a clinic by id
 *     description: Only admins can retrieve a clinic.
 *     tags: [Clinic]
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
 *               $ref: '#/components/schemas/Clinic'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
