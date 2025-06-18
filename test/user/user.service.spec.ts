import { UserService } from '../../src/user/user.service';
import { userRepository } from '../../src/user/user.repository';
import bcrypt from 'bcrypt';

jest.mock('../../src/user/user.repository');

describe('UserService', () => {
  const service = new UserService();

  it('should throw if user already exists', async () => {
    (userRepository.findOne as jest.Mock).mockResolvedValue({ id: 'u1' });
    await expect(service.createUser('test', '123')).rejects.toThrow('User already exists');
  });

  it('should create user with hashed password', async () => {
    (userRepository.findOne as jest.Mock).mockResolvedValue(null);
    (userRepository.create as jest.Mock).mockImplementation(data => data);
    (userRepository.save as jest.Mock).mockImplementation(data => ({ ...data, id: 'u2' }));

    const user = await service.createUser('test', '123');
    expect(user).toHaveProperty('id');
    expect(user.username).toBe('test');
    expect(user.password).not.toBe('123');
    expect(bcrypt.compareSync('123', user.password)).toBeTruthy();
  });
});
