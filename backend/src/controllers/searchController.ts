// src/controllers/searchController.ts
import { Request, Response, NextFunction } from 'express';
import { searchService } from '../services/searchService';
import { sendSuccess } from '../utils/response';

export const searchController = {
  async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const q = (req.query.q as string) || '';
      const results = await searchService.searchAll(q);
      sendSuccess(res, results);
    } catch (err) {
      next(err);
    }
  },
};
