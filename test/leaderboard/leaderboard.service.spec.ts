import { LeaderboardService } from '../../src/leaderboard/leaderboard.service';
import { userStatsRepository } from '../../src/user/user-stats.repository';

jest.mock('../../src/user/user-stats.repository');

describe('LeaderboardService', () => {
  const service = new LeaderboardService();

  it('should return top 10 users ordered by averageDeviation by default', async () => {
    const mockData = [
      { userId: 'u1', averageDeviation: 100, user: {} },
      { userId: 'u2', averageDeviation: 50, user: {} },
    ];

    (userStatsRepository.find as jest.Mock).mockResolvedValue(mockData);

    const result = await service.getTopPlayers();
    expect(userStatsRepository.find).toHaveBeenCalledWith({
      order: { averageDeviation: 'ASC' },
      take: 10,
      relations: ['user'],
    });
    expect(result).toEqual(mockData);
  });

  it('should apply custom limit when provided', async () => {
    (userStatsRepository.find as jest.Mock).mockResolvedValue([]);

    await service.getTopPlayers(5);
    expect(userStatsRepository.find).toHaveBeenCalledWith({
      order: { averageDeviation: 'ASC' },
      take: 5,
      relations: ['user'],
    });
  });
});