import { Router } from 'express';
import { LeaderboardController } from './leaderboard.controller';

const router = Router();
const controller = new LeaderboardController();

// Documentacion generada con agente de IA

/**
 * @swagger
 * tags:
 *   name: Leaderboard
 *   description: Leaderboard
 */

/**
 * @swagger
 * /api/v1/leaderboard:
 *   get:
 *     summary: Devuelve el top 10 de jugadores con mejor precisión
 *     tags: [Leaderboard]
 *     responses:
 *       200:
 *         description: Lista de jugadores ordenados por precisión
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                   totalGames:
 *                     type: integer
 *                   averageDeviation:
 *                     type: number
 *                   bestDeviation:
 *                     type: number
 *                   score:
 *                     type: integer
 */
router.get('/', controller.getTop);

export default router;