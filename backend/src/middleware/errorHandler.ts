// src/middleware/errorHandler.ts - Global error handler
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { logger } from '../utils/logger';
import { sendError } from '../utils/response';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error(`${req.method} ${req.path} - ${err.message}`);

  // Zod validation errors
  if (err instanceof ZodError) {
    const messages = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
    sendError(res, 'Validation failed', 422, messages.join('; '));
    return;
  }

  // App-level business errors
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  // Prisma unique constraint
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      sendError(res, 'A record with this value already exists', 409);
      return;
    }
    if (err.code === 'P2025') {
      sendError(res, 'Record not found', 404);
      return;
    }
    if (err.code === 'P2003') {
      sendError(res, 'Foreign key constraint violation', 409);
      return;
    }
  }

  // Unknown errors
  logger.error(err.stack || err.message);
  sendError(res, 'Internal server error', 500);
};

export const notFound = (_req: Request, res: Response): void => {
  sendError(res, `Route not found`, 404);
};
