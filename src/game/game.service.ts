import { userRepository } from "../user/user.repository";
import { gameRepository } from "./game.repository";
import { userStatsRepository } from '../user/user-stats.repository';
import { GameSession } from './game.entity';
import { IsNull } from 'typeorm';

export class GameService {
  private readonly TARGET_TIME = 10000;
  private readonly ACCEPTABLE_DEVIATION = 500;
  private readonly SESSION_DURATION_MS = 30 * 60 * 1000;
  private readonly userRepository = userRepository;
  private readonly gameRepository = gameRepository;
  private readonly userStatsRepository = userStatsRepository;

  async startGame(userId: string): Promise<GameSession> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const existing = await this.gameRepository.findOne({
      where: {
        userId,
        stopTime: IsNull(),
        expired: false,
      },
      order: { createdAt: 'DESC' },
    });

    const now = Date.now();

    // validamos que exista una sesion abierta
    if (existing) {
      // validamos que la sesion este vigente aun.
      if (existing.expiresAt && now < Number(existing.expiresAt)) {
        throw new Error('You already have an active session.');
      }

      // actualizamos la sesion vencida para ingresar una nueva
      existing.expired = true;
      await this.gameRepository.save(existing);
    }

    const expiresAt = now + this.SESSION_DURATION_MS;

    const session = this.gameRepository.create({
      user,
      userId,
      startTime: now,
      expiresAt,
    });

    return this.gameRepository.save(session);
  }

  async stopGame(userId: string, sessionToken: string): Promise<GameSession> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const session = await this.gameRepository.findOne({
      where: {
        id: sessionToken,
        userId,
        expired: false,
      },
    });

    if (!session) {
      throw new Error('Game session not found');
    }

    if (session.stopTime) {
      throw new Error('This session has already been completed.');
    }

    const now = Date.now();

    if (session.expiresAt && now > Number(session.expiresAt)) {
      session.expired = true;
      await this.gameRepository.save(session);
      throw new Error('Session has expired.');
    }

    session.stopTime = now;
    session.deviation = Math.abs(now - Number(session.startTime) - this.TARGET_TIME);

    await this.gameRepository.save(session);
    await this.updateUserStats(user, session.deviation);

    return session;
  }

  private async updateUserStats(user: { id: string }, newDeviation: number): Promise<void> {

    let stats = await this.userStatsRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (!stats) {
      stats = this.userStatsRepository.create({
        user,
        totalGames: 1,
        averageDeviation: newDeviation,
        bestDeviation: newDeviation,
        score: newDeviation <= this.ACCEPTABLE_DEVIATION ? 1 : 0,
      });
    } else {
      const totalGames = stats.totalGames + 1;

      stats.averageDeviation =
        (stats.averageDeviation * stats.totalGames + newDeviation) / totalGames;

      stats.totalGames = totalGames;
      stats.bestDeviation = Math.min(stats.bestDeviation, newDeviation);

      if (newDeviation <= this.ACCEPTABLE_DEVIATION) {
        stats.score += 1;
      }
    }

    await this.userStatsRepository.save(stats);
  }
}