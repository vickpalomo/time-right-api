import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import 'reflect-metadata';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';

import { prefix } from './config/constants';
import userRoutes from './user/user.routes';
import authRoutes from './auth/auth.routes';
import gameRoutes from './game/game.routes'
import leaderboardRoutes from './leaderboard/leaderboard.routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(`/${prefix}/docs`, swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use(`/${prefix}/users`, userRoutes);
app.use(`/${prefix}/auth`, authRoutes);
app.use(`/${prefix}/games`, gameRoutes);
app.use(`/${prefix}/leaderboard`, leaderboardRoutes);

// Global error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error!' });
});

export default app;