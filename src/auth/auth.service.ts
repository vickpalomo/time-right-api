import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { userRepository } from '../user/user.repository';

dotenv.config();

export class AuthService {
  private readonly jwtSecret: string;
  private readonly userRepository = userRepository;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET ?? 'default_secret';
  }

  async login(username: string, password: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { username }})
    if(!user) {
      throw new Error('User not found')
    }

    const isValid = await bcrypt.compare(password, user.password);
    if(!isValid) {
      throw new Error('Invalid credentials')
    }

    const token = jwt.sign({ userId: user.id }, this.jwtSecret, { expiresIn: '1h' });

    return token;
  }

  async validateToken(token: string): Promise<string> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as { userId: string };
      const user = await this.userRepository.findOne({ where: { id: decoded.userId } });
      if (!user) {
        throw new Error('User not found');
      }
      return decoded.userId;
    } catch (error) {
      console.error('Error validating token:', error);
      throw new Error('Invalid token');
    }
  }

}