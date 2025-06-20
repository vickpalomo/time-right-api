import { AppDataSource } from '../config/database';
import { UserStats } from './user-stats.entity';

export const userStatsRepository = AppDataSource.getRepository(UserStats);