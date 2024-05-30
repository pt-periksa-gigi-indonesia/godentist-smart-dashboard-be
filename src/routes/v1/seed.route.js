const express = require('express');
const seed = require('../../controllers/seed.controller');

const router = express.Router();

router.get('/', seed.seed);

router.get('/latest', seed.latestSeedDate);

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
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 massage:
 *                     type: string
 *                     example: "Database successfully seeded"
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "500":
 *         $ref: '#/components/responses/InternalError'
 */

/**
 * @swagger
 * /seed/latest:
 *   get:
 *     summary: Retrieve the latest seed date
 *     description: All users can retrieve this method.
 *     tags: [Seed]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               properties:
 *                 massage:
 *                     type: string
 *                     example: "Database successfully seeded"
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "500":
 *         $ref: '#/components/responses/InternalError'
 */
