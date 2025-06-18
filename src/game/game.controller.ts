import { RequestHandler } from "express";
import { GameService } from "./game.service";

const gameService = new GameService();

export class GameController {
  public start: RequestHandler = async (req, res): Promise<void> => {
    const { userId } = req.params;

    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const session = await gameService.startGame(userId);
      res.status(201).json({
        sessionToken: session.id,
        expiresAt: session.expiresAt,
      });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  public stop: RequestHandler = async (req, res): Promise<void> => {
    const { userId } = req.params;
    const { sessionToken } = req.body;

    try {
      if (!userId || !sessionToken) {
        throw new Error('User ID and sessionToken are required');
      }

      const session = await gameService.stopGame(userId, sessionToken);

      res.status(200).json({
        deviation: session.deviation,
        stopTime: session.stopTime,
        sessionToken: session.id,
      });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}