// src/services/contentService.ts
import prisma from '../config/prisma';
import { generateContentCode } from '../utils/codeGenerator';
import { AppError } from '../middleware/errorHandler';

export const contentService = {
  async list({ page, limit, search, status, clientId, projectId }: any) {
    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { contentCode: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status) where.status = status;
    if (clientId) where.clientId = clientId;
    if (projectId) where.projectId = projectId;

    const [total, records] = await Promise.all([
      prisma.contentRecord.count({ where }),
      prisma.contentRecord.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          client: { select: { clientName: true } },
          project: { select: { projectName: true } },
        },
      }),
    ]);
    return { data: records, total };
  },

  async getById(id: string) {
    const record = await prisma.contentRecord.findUnique({
      where: { id },
      include: {
        client: { select: { clientName: true } },
        project: { select: { projectName: true } },
      },
    });
    if (!record) throw new AppError('Content record not found', 404);
    return record;
  },

  async create(data: any) {
    const contentCode = await generateContentCode();
    const parseDate = (d?: string) => (d && d !== '' ? new Date(d) : undefined);

    return prisma.contentRecord.create({
      data: {
        contentCode,
        title: data.title,
        contentType: data.contentType ?? 'Technical_Blog',
        platform: data.platform ?? 'LinkedIn',
        status: data.status ?? 'Idea',
        ideaDate: parseDate(data.ideaDate),
        draftDate: parseDate(data.draftDate),
        scheduledDate: parseDate(data.scheduledDate),
        publishedDate: parseDate(data.publishedDate),
        url: data.url || null,
        clientId: data.clientId || null,
        projectId: data.projectId || null,
        contentPillar: data.contentPillar ?? 'Engineering_Excellence',
        cta: data.cta,
        author: data.author,
        notes: data.notes,
      },
      include: {
        client: { select: { clientName: true } },
        project: { select: { projectName: true } },
      },
    });
  },

  async update(id: string, data: any) {
    await contentService.getById(id);
    const parseDate = (d?: string) => (d && d !== '' ? new Date(d) : undefined);

    return prisma.contentRecord.update({
      where: { id },
      data: {
        ...data,
        url: data.url || undefined,
        clientId: data.clientId || undefined,
        projectId: data.projectId || undefined,
        ideaDate: parseDate(data.ideaDate),
        draftDate: parseDate(data.draftDate),
        scheduledDate: parseDate(data.scheduledDate),
        publishedDate: parseDate(data.publishedDate),
      },
      include: {
        client: { select: { clientName: true } },
        project: { select: { projectName: true } },
      },
    });
  },

  async delete(id: string) {
    await contentService.getById(id);
    return prisma.contentRecord.delete({ where: { id } });
  },
};
