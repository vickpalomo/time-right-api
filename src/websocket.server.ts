import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';

let clients: WebSocket[] = [];

export function setupWebSocket(server: http.Server) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    clients.push(ws);

    ws.on('close', () => {
      clients = clients.filter(client => client !== ws);
    });
  });
}

export function broadcastLeaderboardUpdate(data: any) {
  const response = data.map((p: { user: { id: any; }; totalGames: any; averageDeviation: number; bestDeviation: number; score: any; }) => ({
          userId: p.user.id,
          totalGames: p.totalGames,
          averageDeviation: Math.round(p.averageDeviation),
          bestDeviation: Math.round(p.bestDeviation),
          score: p.score,
        }));

  const message = JSON.stringify({ type: 'LEADERBOARD_UPDATE', payload: response });

  clients.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  });
}