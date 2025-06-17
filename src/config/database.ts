import { DataSource } from 'typeorm';
import path from 'path';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: path.join(__dirname, '../../database.sqlite'),
  synchronize: true,
  logging: process.env.NODE_ENV !== 'production',
  entities: [],
  migrations: [],
  subscribers: [],
});
