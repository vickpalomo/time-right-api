import { userStatsRepository } from '../user/user-stats.repository';

export class LeaderboardService {
  async getTopPlayers(limit = 10) {
    return userStatsRepository.find({
      order: { averageDeviation: 'ASC' },
      take: limit,
      relations: ['user'],
    });
  }
}