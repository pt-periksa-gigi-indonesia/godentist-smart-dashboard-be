const express = require('express');
const auth = require('../../middlewares/auth');
const seed = require('../../controllers/seed.controller');

const router = express.Router();

router.route('/').get(auth('manageUsers'), seed.seed);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Seed
 *   description: Seed data management
 */

/**
 * @swagger
 * /seed:
 *   get:
 *     summary: Refresh database with seed data
 *     description: All users can retrieve this method.
 *     tags: [Seed]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Seed'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "500":
 *         $ref: '#/components/responses/InternalError'
 */
