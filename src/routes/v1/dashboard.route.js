const express = require('express');
const auth = require('../../middlewares/auth');
const dashboardController = require('../../controllers/dashboard.controller');

const router = express.Router();

router.get('/', auth('admin'), dashboardController.getDashboardData);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard retrieval
 */

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Get dashboard information
 *     description: Only admins can retrieve dashboard.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 doctorCount:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       count:
 *                         type: integer
 *                         example: 1
 *                       verificationStatus:
 *                         type: string
 *                         example: verified
 *                 clinicCount:
 *                   type: integer
 *                   example: 5
 *                 consultationPatientsCount:
 *                   type: integer
 *                   example: 48
 *                 clinicPatientsCount:
 *                   type: integer
 *                   example: 5
 *                 totalAmountFromClinic:
 *                   type: integer
 *                   example: 1300000
 *                 totalAmountFromConsultation:
 *                   type: integer
 *                   example: 763000
 *                 latestFeedbacks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: drg. John
 *                       feedback:
 *                         type: string
 *                         example: ini feedback pertama dr john doe
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2024-05-14T13:30:12.636Z
 *                 popularServices:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       timesBooked:
 *                         type: integer
 *                         example: 3
 *                       serviceName:
 *                         type: string
 *                         example: Veener
 *                 totalTransactionsEachMonth:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       totalRevenue:
 *                         type: integer
 *                         example: 1972000
 *                       month:
 *                         type: string
 *                         example: May
 *                 notification:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       doctorName:
 *                         type: string
 *                         example: drg. John
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
