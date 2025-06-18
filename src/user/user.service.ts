import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { User } from './user.entity'
import { userRepository } from './user.repository';

dotenv.config();

export class UserService {
  private readonly userRepository = userRepository;

  async createUser(username: string, password: string): Promise<User> {

    const existingUser = await this.userRepository.findOne({ where: { username } });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      username,
      password: hashedPassword
    });

    return this.userRepository.save(newUser);
  }
}