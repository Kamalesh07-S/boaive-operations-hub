// src/utils/response.ts - Standardized API response helpers
import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200
): Response => {
  return res.status(statusCode).json({ success: true, data, message } satisfies ApiResponse<T>);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 400,
  error?: string
): Response => {
  return res.status(statusCode).json({ success: false, message, error } satisfies ApiResponse);
};

export const sendPaginated = <T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number
): Response => {
  return res.status(200).json({
    success: true,
    data,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  } satisfies ApiResponse<T[]>);
};
