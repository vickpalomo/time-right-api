import express from 'express';
import { AppDataSource } from './config/database';

const app = express();
app.use(express.json());

// Inicia la base de datos
AppDataSource.initialize()
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.error('Error during DB initialization:', err);
  });

export default app;