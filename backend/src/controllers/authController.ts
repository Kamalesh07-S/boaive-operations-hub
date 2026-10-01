// src/controllers/authController.ts
import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { sendSuccess } from '../utils/response';

export const authController = {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      // Set HTTP-only cookie for browsers + return token for API clients
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      sendSuccess(res, result, 'Login successful');
    } catch (err) {
      next(err);
    }
  },

  async logout(_req: Request, res: Response): Promise<void> {
    res.clearCookie('token');
    sendSuccess(res, null, 'Logged out successfully');
  },

  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await authService.me(req.user!.userId);
      sendSuccess(res, user);
    } catch (err) {
      next(err);
    }
  },
};
