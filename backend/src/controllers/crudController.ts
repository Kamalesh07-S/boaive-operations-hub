// src/controllers/crudController.ts
// Generic CRUD controller factory to eliminate boilerplate across all entities

import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendPaginated } from '../utils/response';

type ServiceWithCRUD = {
  list(opts: any): Promise<{ data: any[]; total: number }>;
  getById(id: string): Promise<any>;
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
  delete(id: string): Promise<any>;
};

export function createCrudController(service: ServiceWithCRUD, entityName: string) {
  return {
    async list(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const page = parseInt(String(req.query.page ?? '1')) || 1;
        const limit = Math.min(parseInt(String(req.query.limit ?? '20')) || 20, 100);
        const search = req.query.search ? String(req.query.search) : undefined;
        const status = req.query.status ? String(req.query.status) : undefined;
        const priority = req.query.priority ? String(req.query.priority) : undefined;
        const clientId = req.query.clientId ? String(req.query.clientId) : undefined;
        const projectId = req.query.projectId ? String(req.query.projectId) : undefined;

        const { data, total } = await service.list({ page, limit, search, status, priority, clientId, projectId });
        sendPaginated(res, data, page, limit, total);
      } catch (err) {
        next(err);
      }
    },

    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const data = await service.getById(String(req.params['id']));
        sendSuccess(res, data);
      } catch (err) {
        next(err);
      }
    },

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const data = await service.create(req.body);
        sendSuccess(res, data, `${entityName} created successfully`, 201);
      } catch (err) {
        next(err);
      }
    },

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const data = await service.update(String(req.params['id']), req.body);
        sendSuccess(res, data, `${entityName} updated successfully`);
      } catch (err) {
        next(err);
      }
    },

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        await service.delete(String(req.params['id']));
        sendSuccess(res, null, `${entityName} deleted successfully`);
      } catch (err) {
        next(err);
      }
    },
  };
}
