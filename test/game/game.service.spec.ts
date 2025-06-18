import { GameService } from '../../src/game/game.service';
import { userRepository } from '../../src/user/user.repository';
import { gameRepository } from '../../src/game/game.repository';
import { userStatsRepository } from '../../src/user/user-stats.repository';

jest.mock('../../src/user/user.repository');
jest.mock('../../src/game/game.repository');
jest.mock('../../src/user/user-stats.repository');

describe('GameService', () => {
  let service: GameService;

  beforeEach(() => {
    service = new GameService();
    jest.clearAllMocks();
  });

  describe('startGame', () => {
    it('should start a new session if no previous session exists', async () => {
      const user = { id: 'u1' };

      (userRepository.findOne as jest.Mock).mockResolvedValue(user);
      (gameRepository.findOne as jest.Mock).mockResolvedValue(null);
      (gameRepository.create as jest.Mock).mockImplementation(data => data);
      (gameRepository.save as jest.Mock).mockImplementation(data => ({
        ...data,
        id: 'new-session-id',
      }));

      const result = await service.startGame('u1');

      expect(result).toHaveProperty('id', 'new-session-id');
      expect(result).toHaveProperty('userId', 'u1');
      expect(result.expired).toBeFalsy();
      expect(gameRepository.save).toHaveBeenCalled();
    });

    it('should start a new session if previous is expired', async () => {
      const user = { id: 'u1' };
      const expiredSession = {
        id: 'oldSession',
        expiresAt: Date.now() - 1000,
        expired: false,
        stopTime: null,
      };

      (userRepository.findOne as jest.Mock).mockResolvedValue(user);
      (gameRepository.findOne as jest.Mock).mockResolvedValue(expiredSession);
      (gameRepository.save as jest.Mock).mockResolvedValueOnce({ ...expiredSession, expired: true });
      (gameRepository.create as jest.Mock).mockImplementation(data => data);
      (gameRepository.save as jest.Mock).mockResolvedValueOnce({
        ...expiredSession,
        id: 'newSession',
        expired: false,
      });

      const result = await service.startGame('u1');

      expect(result.id).toBe('newSession');
      expect(result.expired).toBe(false);
    });
    it('should throw error if user not found', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(undefined);

      await expect(service.startGame('non-existent')).rejects.toThrow('User not found');
    });

    it('should create new session if no active session', async () => {
      const user = { id: 'u1' };
      (userRepository.findOne as jest.Mock).mockResolvedValue(user);
      (gameRepository.findOne as jest.Mock).mockResolvedValue(null);
      (gameRepository.create as jest.Mock).mockImplementation(data => data);
      (gameRepository.save as jest.Mock).mockImplementation(data => ({ ...data, id: 'session123' }));

      const session = await service.startGame('u1');

      expect(session.id).toBe('session123');
      expect(gameRepository.save).toHaveBeenCalled();
    });
  });

  describe('stopGame', () => {
    it('should stop session and update stats', async () => {
      const user = { id: 'u1' };
      const now = Date.now();
      const session = {
        id: 's1',
        userId: 'u1',
        startTime: now - 10000,
        expiresAt: now + 1000,
        expired: false,
        stopTime: null,
      };

      (userRepository.findOne as jest.Mock).mockResolvedValue(user);
      (gameRepository.findOne as jest.Mock).mockResolvedValue(session);
      (gameRepository.save as jest.Mock).mockImplementation(data => data);
      (userStatsRepository.findOne as jest.Mock).mockResolvedValue(null);
      (userStatsRepository.create as jest.Mock).mockImplementation(data => data);
      (userStatsRepository.save as jest.Mock).mockResolvedValue({});

      const result = await service.stopGame('u1', 's1');

      expect(result.stopTime).toBeDefined();
      expect(result.deviation).toBeLessThanOrEqual(500);
      expect(userStatsRepository.save).toHaveBeenCalled();
    });

    it('should throw error if user not found', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue(undefined);

      await expect(service.stopGame('u1', 's1')).rejects.toThrow('User not found');
    });

    it('should throw error if session not found', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue({ id: 'u1' });
      (gameRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.stopGame('u1', 'badSession')).rejects.toThrow('Game session not found');
    });

    it('should throw error if session already stopped', async () => {
      (userRepository.findOne as jest.Mock).mockResolvedValue({ id: 'u1' });
      (gameRepository.findOne as jest.Mock).mockResolvedValue({ id: 's1', stopTime: Date.now(), userId: 'u1' });

      await expect(service.stopGame('u1', 's1')).rejects.toThrow('This session has already been completed.');
    });
  });
});
