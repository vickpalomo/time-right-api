import { RequestHandler } from "express";
import { LeaderboardService } from "./leaderboard.service";

const leaderboardService = new LeaderboardService();

export class LeaderboardController {
  public getTop: RequestHandler = async (req, res): Promise<void> => {
    try {
      const players = await leaderboardService.getTopPlayers();
      res.json(
        players.map(p => ({
          userId: p.user.id,
          totalGames: p.totalGames,
          averageDeviation: Math.round(p.averageDeviation),
          bestDeviation: Math.round(p.bestDeviation),
          score: p.score,
        }))
      );
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
  }
}