import { AuthService } from '../../src/auth/auth.service';
import { userRepository } from '../../src/user/user.repository';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

describe('AuthService', () => {
  const service = new AuthService();

  const mockUser = {
    id: 'user123',
    username: 'testuser',
    password: bcrypt.hashSync('securePass', 10),
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should throw if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.login('notfound', 'pass'))
        .rejects
        .toThrow('User not found');
    });

    it('should throw if password is incorrect', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue({ ...mockUser, password: bcrypt.hashSync('otherPass', 10) });

      await expect(service.login('testuser', 'wrongpass'))
        .rejects
        .toThrow('Invalid credentials');
    });

    it('should return a token on valid credentials', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

      const token = await service.login('testuser', 'securePass');
      expect(typeof token).toBe('string');

      const decoded = jwt.verify(token, process.env.JWT_SECRET ?? 'default_secret') as any;
      expect(decoded.userId).toBe(mockUser.id);
    });
  });

  describe('validateToken', () => {
    it('should throw on invalid token', async () => {
      await expect(service.validateToken('bad.token'))
        .rejects
        .toThrow('Invalid token');
    });

    it('should throw if user from token is not found', async () => {
      const token = jwt.sign({ userId: 'missing' }, process.env.JWT_SECRET ?? 'default_secret');
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.validateToken(token))
        .rejects
        .toThrow('Invalid token');
    });

    it('should return userId for valid token and user exists', async () => {
      const token = jwt.sign({ userId: mockUser.id }, process.env.JWT_SECRET ?? 'default_secret');
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

      const userId = await service.validateToken(token);
      expect(userId).toBe(mockUser.id);
    });
  });
});
