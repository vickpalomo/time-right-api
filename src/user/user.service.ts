import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { User } from './user.entity'
import { userRepository } from './user.repository';

dotenv.config();

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? 3600;

export class UserService {
  private readonly jwtSecret: string;
  private readonly userRepository = userRepository;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET ?? 'default_secret';
  }

  async createUser(username: string, password: string): Promise<User> {

    const existingUser = await this.userRepository.findOne({ where: { username } });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      username,
      password: hashedPassword,
      totalGames: 0,
      averageDeviation: 0,
      bestDeviation: 999999
    });

    return this.userRepository.save(newUser);
  }
}