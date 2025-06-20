// Generado con ayuda de agente IA, 
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

const authService = new AuthService();

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Token is required' });
    return;
  }

  try {
    const userId = await authService.validateToken(token);
    req.userId = userId;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};