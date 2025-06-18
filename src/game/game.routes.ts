// codigo generado por ia para la documentacion de swagger
import { Router } from 'express';
import { GameController } from './game.controller';
import { authenticateToken } from '../auth/auth.middleware';

const router = Router();
const controller = new GameController();

/**
 * @swagger
 * tags:
 *   name: Games
 *   description: Game management
 */

/**
 * @swagger
 * /api/v1/games/{userId}/start:
 *   post:
 *     summary: Inicia una sesión de juego
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Sesión iniciada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sessionToken:
 *                   type: string
 *                 expiresAt:
 *                   type: number
 *       400:
 *         description: Error de validación o sesión activa
 *       401:
 *         description: Token no proporcionado
 *       403:
 *         description: Token inválido o expirado
 */
router.post('/:userId/start', authenticateToken, controller.start);

/**
 * @swagger
 * /api/v1/games/{userId}/stop:
 *   post:
 *     summary: Finaliza una sesión de juego
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionToken:
 *                 type: string
 *                 description: Token de la sesión de juego iniciada
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión detenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deviation:
 *                   type: number
 *                 stopTime:
 *                   type: number
 *                 sessionToken:
 *                   type: string
 *       400:
 *         description: Datos inválidos o sesión inexistente
 *       401:
 *         description: Token no proporcionado
 *       403:
 *         description: Token inválido o expirado
 */
router.post('/:userId/stop', authenticateToken, controller.stop);

export default router;