// src/services/taskService.ts
import prisma from '../config/prisma';
import { generateTaskCode } from '../utils/codeGenerator';
import { AppError } from '../middleware/errorHandler';

export const taskService = {
  async list({ page, limit, search, status, priority, projectId, clientId }: any) {
    const now = new Date();
    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { taskCode: { contains: search, mode: 'insensitive' } },
        { assignedTo: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (projectId) where.projectId = projectId;
    if (clientId) where.clientId = clientId;

    const [total, tasks] = await Promise.all([
      prisma.task.count({ where }),
      prisma.task.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ priority: 'desc' }, { dueDate: 'asc' }],
        include: {
          project: { select: { projectName: true, projectCode: true } },
        },
      }),
    ]);

    // Auto-mark overdue
    const tasksWithStatus = tasks.map((t) => ({
      ...t,
      status:
        t.status !== 'Completed' && t.dueDate && new Date(t.dueDate) < now
          ? 'Overdue'
          : t.status,
    }));

    return { data: tasksWithStatus, total };
  },

  async getById(id: string) {
    const task = await prisma.task.findUnique({
      where: { id },
      include: { project: { select: { projectName: true, projectCode: true } } },
    });
    if (!task) throw new AppError('Task not found', 404);

    const now = new Date();
    const effectiveStatus =
      task.status !== 'Completed' && task.dueDate && new Date(task.dueDate) < now
        ? 'Overdue'
        : task.status;

    return { ...task, status: effectiveStatus };
  },

  async create(data: any) {
    const taskCode = await generateTaskCode();
    const parseDate = (d?: string) => (d && d !== '' ? new Date(d) : undefined);

    return prisma.task.create({
      data: {
        taskCode,
        title: data.title,
        projectId: data.projectId || null,
        clientId: data.clientId || null,
        category: data.category ?? 'Development',
        priority: data.priority ?? 'Medium',
        status: data.status ?? 'Todo',
        dueDate: parseDate(data.dueDate),
        assignedTo: data.assignedTo,
        notes: data.notes,
      },
      include: { project: { select: { projectName: true, projectCode: true } } },
    });
  },

  async update(id: string, data: any) {
    await taskService.getById(id);
    const parseDate = (d?: string) => (d && d !== '' ? new Date(d) : undefined);

    return prisma.task.update({
      where: { id },
      data: {
        ...data,
        projectId: data.projectId || undefined,
        clientId: data.clientId || undefined,
        dueDate: parseDate(data.dueDate),
      },
      include: { project: { select: { projectName: true, projectCode: true } } },
    });
  },

  async delete(id: string) {
    await taskService.getById(id);
    return prisma.task.delete({ where: { id } });
  },
};
