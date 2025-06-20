import { AppDataSource } from '../config/database';
import { GameSession } from './game.entity';

export const gameRepository = AppDataSource.getRepository(GameSession);