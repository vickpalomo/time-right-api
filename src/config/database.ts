import { DataSource } from 'typeorm';
import path from 'path';
import { User } from '../user/user.entity'
import { GameSession } from '../game/game.entity';
import { UserStats } from '../user/user-stats.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: path.join(__dirname, '../../database.sqlite'),
  synchronize: true,
  logging: process.env.NODE_ENV !== 'production',
  entities: [User, GameSession, UserStats],
  migrations: [],
  subscribers: [],
});
