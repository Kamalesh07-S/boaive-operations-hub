// src/controllers/dashboardController.ts
import { Request, Response, NextFunction } from 'express';
import { dashboardService } from '../services/dashboardService';
import { sendSuccess } from '../utils/response';

export const dashboardController = {
  async getDashboard(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await dashboardService.getDashboard();
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  },
};
