import { AppDataSource } from '../config/database';
import { User } from './user.entity';

export const userRepository = AppDataSource.getRepository(User);