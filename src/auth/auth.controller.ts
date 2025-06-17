import { RequestHandler } from 'express';
import { AuthService } from './auth.service';

const authService = new AuthService();

export class AuthController {
  public login: RequestHandler = async (req, res): Promise<void> => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password || username.trim() === '' || password.trim() === '') {
        throw new Error('Username and password are required and cannot be blank');
      }

      const token = await authService.login(username, password);
      res.status(200).json({ token });
    } catch (error) {
      res.status(401).json({ error: (error as Error).message });
    }
  }
}