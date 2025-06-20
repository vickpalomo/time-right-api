import http from 'http';
import { AppDataSource } from './config/database';
import app from './app';
import { setupWebSocket } from './websocket.server';

const server = http.createServer(app);
setupWebSocket(server);

// Initialized database
AppDataSource.initialize()
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.error('Error during DB initialization:', err);
  });

  const PORT = process.env.PORT || 3000;

  // Inicia el server de la app
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});