import { RequestHandler } from 'express';
import { UserService } from './user.service';

const userService = new UserService();

export class UserController {
  public create: RequestHandler = async (req, res): Promise<void> => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password || username.trim() === '' || password.trim() === '') {
        throw new Error('Username and password are required and cannot be blank');
      }

      const user = await userService.createUser(username, password);
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}