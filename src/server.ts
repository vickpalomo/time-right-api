import { AppDataSource } from './config/database';
import app from './app';

const PORT = process.env.PORT || 3000;

// Initialized database
AppDataSource.initialize()
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.error('Error during DB initialization:', err);
  });

  // Inicia el server de la app
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});