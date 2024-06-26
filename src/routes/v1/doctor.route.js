const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const doctorController = require('../../controllers/doctor.controller');
const doctorValidation = require('../../validations/doctor.validation');

const router = express.Router();

router.get('/', auth('admin'), validate(doctorValidation.getDoctors), doctorController.getDoctors);

router.get('/:doctorId', auth('admin'), validate(doctorValidation.getDoctor), doctorController.getDoctorById);

router.patch('/verify/:doctorId', auth('admin'), validate(doctorValidation.verifyDoctor), doctorController.verifyDoctor);

router.post('/ocr-card', auth('admin'), validate(doctorValidation.ocrDoctorCard), doctorController.ocrDoctorCard);

router.post('/ocr', auth('admin'), validate(doctorValidation.ocrDoctorCardDB), doctorController.ocrDoctorCardDB);

router.post('/edit-ocr', auth('admin'), validate(doctorValidation.editOcrDoctorCard), doctorController.editOcrDoctorCard);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Doctor
 *   description: Doctor management and retrieval
 */

/**
 * @swagger
 * /doctors:
 *   get:
 *     summary: Get all doctors
 *     description: Only admins can retrieve all doctors.
 *     tags: [Doctor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: Filter doctors by id.
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter doctors by name.
 *       - in: query
 *         name: verificationStatus
 *         schema:
 *           type: string
 *         description: Filter doctors by verification status.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort doctors by a specific field in the form of field:desc/asc (ex. name:asc).
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of doctors to retrieve.
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
 *                         example: "Dr. John Doe"
 *                       verificationStatus:
 *                         type: string
 *                         example: "verified"
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
 *                 verificationStatusCount:
 *                   type: array
 *                   items:
 *                     properties:
 *                       count:
 *                         type: integer
 *                         example: 2
 *                       verificationStatus:
 *                         type: string
 *                         example: "unverified"
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /doctors/{doctorId}:
 *   get:
 *     summary: Get a doctor by id
 *     description: Only admins can retrieve a doctor.
 *     tags: [Doctor]
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
 *               $ref: '#/components/schemas/Doctor'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /doctors/verify/{doctorId}:
 *   patch:
 *     summary: Verify a doctor
 *     description: Only admins can verify doctors.
 *     tags: [Doctor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *         description: The doctor ID.
 *     requestBody:
 *       required: true
 *       description: Verification details of the doctor
 *       content:
 *         application/json:
 *           schema:
 *              properties:
 *                 verificationStatus:
 *                     type: string
 *                     example: "verified"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 massage:
 *                     type: string
 *                     example: "Doctor verification status updated"
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /doctors/ocr:
 *   post:
 *     summary: OCR doctor card using database integration
 *     description: Only admins can retrieve a OCR doctor card.
 *     tags: [Doctor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       description: Doctor ID
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               doctorId:
 *                 type: number
 *                 example: 1
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 NAMA:
 *                   type: string
 *                   example: "RIYANTO, SE"
 *                 NIK:
 *                   type: string
 *                   example: "3471140209790101"
 *                 Tempat Tanggal Lahir:
 *                   type: string
 *                   example: "GROBOGAN, 02091979"
 *                 ALAMAT:
 *                   type: string
 *                   example: "PAM PURI DOMAS D3 SEMPU\no. 91"
 *                 JENIS KELAMIN:
 *                   type: string
 *                   example: "LAKI-LAKI"
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /doctors/ocr-card:
 *   post:
 *     summary: OCR doctor card
 *     description: Only admins can retrieve a OCR doctor card.
 *     tags: [Doctor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       description: Doctor ID
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               doctorId:
 *                 type: number
 *                 example: 1
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 NAMA:
 *                   type: string
 *                   example: "RIYANTO, SE"
 *                 NIK:
 *                   type: string
 *                   example: "3471140209790101"
 *                 Tempat Tanggal Lahir:
 *                   type: string
 *                   example: "GROBOGAN, 02091979"
 *                 ALAMAT:
 *                   type: string
 *                   example: "PAM PURI DOMAS D3 SEMPU\no. 91"
 *                 JENIS KELAMIN:
 *                   type: string
 *                   example: "LAKI-LAKI"
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /doctors/edit-ocr:
 *   post:
 *     summary: OCR doctor card
 *     description: Only admins can edit OCR card and you can put another request body, like nama, nik, or jenisKelamin (optional) just put the variable you want to changes.
 *     tags: [Doctor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       description: Doctor ID
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               doctorId:
 *                 type: number
 *                 example: 1
 *               nama:
 *                 type: string
 *                 example: "RIYANTO, SE"
 *               jenisKelamin:
 *                 type: string
 *                 example: "LAKI-LAKI"
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 NAMA:
 *                   type: string
 *                   example: "RIYANTO, SE"
 *                 NIK:
 *                   type: string
 *                   example: "3471140209790101"
 *                 Tempat Tanggal Lahir:
 *                   type: string
 *                   example: "GROBOGAN, 02091979"
 *                 ALAMAT:
 *                   type: string
 *                   example: "PAM PURI DOMAS D3 SEMPU\no. 91"
 *                 JENIS KELAMIN:
 *                   type: string
 *                   example: "LAKI-LAKI"
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
