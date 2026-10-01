// src/services/financeService.ts
import prisma from '../config/prisma';
import { generateFinanceCode } from '../utils/codeGenerator';
import { AppError } from '../middleware/errorHandler';

export const financeService = {
  async list({ page, limit, search, status, clientId, projectId }: any) {
    const where: any = {};
    if (search) {
      where.OR = [
        { description: { contains: search, mode: 'insensitive' } },
        { transactionCode: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status) where.paymentStatus = status;
    if (clientId) where.clientId = clientId;
    if (projectId) where.projectId = projectId;

    const [total, records] = await Promise.all([
      prisma.financeRecord.count({ where }),
      prisma.financeRecord.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { date: 'desc' },
        include: {
          client: { select: { clientName: true } },
          project: { select: { projectName: true } },
        },
      }),
    ]);
    return { data: records, total };
  },

  async getById(id: string) {
    const record = await prisma.financeRecord.findUnique({
      where: { id },
      include: {
        client: { select: { clientName: true } },
        project: { select: { projectName: true } },
      },
    });
    if (!record) throw new AppError('Finance record not found', 404);
    return record;
  },

  async create(data: any) {
    const transactionCode = await generateFinanceCode();
    const parseDate = (d?: string) => (d && d !== '' ? new Date(d) : undefined);

    return prisma.financeRecord.create({
      data: {
        transactionCode,
        date: parseDate(data.date) ?? new Date(),
        type: data.type,
        clientId: data.clientId || null,
        projectId: data.projectId || null,
        description: data.description,
        amount: data.amount,
        paymentStatus: data.paymentStatus ?? 'Draft',
        paidDate: parseDate(data.paidDate),
        paymentMethod: data.paymentMethod,
      },
      include: {
        client: { select: { clientName: true } },
        project: { select: { projectName: true } },
      },
    });
  },

  async update(id: string, data: any) {
    await financeService.getById(id);
    const parseDate = (d?: string) => (d && d !== '' ? new Date(d) : undefined);

    return prisma.financeRecord.update({
      where: { id },
      data: {
        ...data,
        clientId: data.clientId || undefined,
        projectId: data.projectId || undefined,
        date: parseDate(data.date),
        paidDate: parseDate(data.paidDate),
      },
      include: {
        client: { select: { clientName: true } },
        project: { select: { projectName: true } },
      },
    });
  },

  async delete(id: string) {
    await financeService.getById(id);
    return prisma.financeRecord.delete({ where: { id } });
  },
};
